import { NextResponse } from 'next/server';

const DEFAULT_SECRET = Buffer.from('c2Jfc2VjcmV0X093UXpabVVfV1MyTUpaUloxb1BqdG1fWGdzeHhBNmg=', 'base64').toString('ascii');
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;

const SUPABASE_REST_URL = 'http://31.220.93.65:8000';
const SUPABASE_STORAGE_URL = 'http://31.220.93.65:9000';
const BUCKET = 'site-media';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'music';
    const slug = searchParams.get('slug') || 'default';

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const uploadId = formData.get('uploadId') as string;
    const chunkIndexStr = formData.get('chunkIndex') as string;
    const totalChunksStr = formData.get('totalChunks') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const chunkIndex = chunkIndexStr ? parseInt(chunkIndexStr, 10) : 0;
    const totalChunks = totalChunksStr ? parseInt(totalChunksStr, 10) : 1;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = file.type || 'audio/mpeg';

    // 1. Ensure bucket 'site-media' exists
    for (const host of [SUPABASE_REST_URL, SUPABASE_STORAGE_URL]) {
      try {
        await fetch(`${host}/storage/v1/bucket`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
          },
          body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
        });
      } catch (_) {}
    }

    // Single chunk / small file upload
    if (totalChunks <= 1) {
      const ext = file.name.split('.').pop() || 'mp3';
      const fileName = `${category}-${Date.now()}.${ext}`;
      const filePath = `${slug}/${category}/${fileName}`;

      for (const host of [SUPABASE_STORAGE_URL, SUPABASE_REST_URL]) {
        try {
          const uploadRes = await fetch(`${host}/storage/v1/object/${BUCKET}/${filePath}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'Content-Type': contentType,
              'apikey': SERVICE_ROLE_KEY,
              'x-upsert': 'true',
            },
            body: buffer,
          });

          if (uploadRes.ok) {
            const directUrl = `${SUPABASE_STORAGE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;
            const proxyUrl = `/api/audio?path=${encodeURIComponent(filePath)}`;
            return NextResponse.json({ success: true, url: directUrl, proxyUrl, isComplete: true });
          }
        } catch (_) {}
      }

      return NextResponse.json({ success: false, error: 'Failed to save file to Supabase' }, { status: 500 });
    }

    // Chunked upload for files > 3.5MB to bypass Vercel 4.5MB limit
    const activeUploadId = uploadId || `up_${Date.now()}`;
    const tmpPath = `tmp_${activeUploadId}_part_${chunkIndex}`;

    // Upload current chunk to temp location in Supabase
    let chunkSaved = false;
    for (const host of [SUPABASE_STORAGE_URL, SUPABASE_REST_URL]) {
      try {
        const chunkRes = await fetch(`${host}/storage/v1/object/${BUCKET}/${tmpPath}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/octet-stream',
            'apikey': SERVICE_ROLE_KEY,
            'x-upsert': 'true',
          },
          body: buffer,
        });

        if (chunkRes.ok) {
          chunkSaved = true;
          break;
        }
      } catch (_) {}
    }

    if (!chunkSaved) {
      return NextResponse.json({ success: false, error: `Failed to save chunk ${chunkIndex}` }, { status: 500 });
    }

    // If not the last chunk, acknowledge receipt
    if (chunkIndex < totalChunks - 1) {
      return NextResponse.json({ success: true, isComplete: false });
    }

    // LAST CHUNK: Assemble all chunks into final file
    const buffers: Buffer[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const partPath = `tmp_${activeUploadId}_part_${i}`;
      let partBuf: Buffer | null = null;

      for (const host of [SUPABASE_STORAGE_URL, SUPABASE_REST_URL]) {
        try {
          const getRes = await fetch(`${host}/storage/v1/object/${BUCKET}/${partPath}`, {
            headers: {
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'apikey': SERVICE_ROLE_KEY,
            },
          });
          if (getRes.ok) {
            partBuf = Buffer.from(await getRes.arrayBuffer());
            break;
          }
        } catch (_) {}
      }

      if (!partBuf) {
        return NextResponse.json({ success: false, error: `Failed to assemble chunk ${i}` }, { status: 500 });
      }
      buffers.push(partBuf);
    }

    const finalBuffer = Buffer.concat(buffers);
    const ext = file.name.split('.').pop() || 'mp3';
    const fileName = `${category}-${Date.now()}.${ext}`;
    const filePath = `${slug}/${category}/${fileName}`;

    // Upload assembled final file
    let finalSaved = false;
    for (const host of [SUPABASE_STORAGE_URL, SUPABASE_REST_URL]) {
      try {
        const finalRes = await fetch(`${host}/storage/v1/object/${BUCKET}/${filePath}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': contentType,
            'apikey': SERVICE_ROLE_KEY,
            'x-upsert': 'true',
          },
          body: finalBuffer,
        });

        if (finalRes.ok) {
          finalSaved = true;
          break;
        }
      } catch (_) {}
    }

    // Clean up temp parts
    for (let i = 0; i < totalChunks; i++) {
      const partPath = `tmp_${activeUploadId}_part_${i}`;
      for (const host of [SUPABASE_STORAGE_URL, SUPABASE_REST_URL]) {
        fetch(`${host}/storage/v1/object/${BUCKET}/${partPath}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY,
          },
        }).catch(() => {});
      }
    }

    if (finalSaved) {
      const directUrl = `${SUPABASE_STORAGE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;
      const proxyUrl = `/api/audio?path=${encodeURIComponent(filePath)}`;
      return NextResponse.json({ success: true, url: directUrl, proxyUrl, isComplete: true });
    }

    return NextResponse.json({ success: false, error: 'Failed to assemble audio on Supabase' }, { status: 500 });

  } catch (err: any) {
    console.error('[API Upload] Exception:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
