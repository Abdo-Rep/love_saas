import { NextResponse } from 'next/server';

const DEFAULT_SECRET = Buffer.from('c2Jfc2VjcmV0X093UXpabVVfV1MyTUpaUloxb1BqdG1fWGdzeHhBNmg=', 'base64').toString('ascii');
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://31.220.93.65:8000';
const SUPABASE_URL = rawUrl.startsWith('http') ? rawUrl : `http://${rawUrl}`;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;
const BUCKET = 'audio';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const uploadId = formData.get('uploadId') as string;
    const fileName = formData.get('fileName') as string;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string, 10);
    const totalChunks = parseInt(formData.get('totalChunks') as string, 10);
    const chunkFile = formData.get('chunk') as File;

    if (!uploadId || !fileName || isNaN(chunkIndex) || isNaN(totalChunks) || !chunkFile) {
      return NextResponse.json({ success: false, error: 'Missing chunk parameters' }, { status: 400 });
    }

    const arrayBuffer = await chunkFile.arrayBuffer();
    const chunkBuffer = Buffer.from(arrayBuffer);

    // 1. Ensure bucket exists
    await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
    }).catch(() => {});

    // 2. Save current chunk as temp file in Supabase Storage
    const partPath = `tmp_${uploadId}_part_${chunkIndex}`;
    const uploadPartRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${partPath}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/octet-stream',
        'apikey': SERVICE_ROLE_KEY,
        'x-upsert': 'true',
      },
      body: chunkBuffer,
    });

    if (!uploadPartRes.ok) {
      const errText = await uploadPartRes.text().catch(() => '');
      console.error(`[upload-chunk] Part ${chunkIndex} upload failed:`, uploadPartRes.status, errText);
      return NextResponse.json({ success: false, error: `Supabase Storage ${uploadPartRes.status}: ${errText || 'Upload rejected'}` }, { status: 500 });
    }

    // 3. If this is NOT the last chunk, acknowledge receipt
    if (chunkIndex < totalChunks - 1) {
      return NextResponse.json({ success: true, isComplete: false });
    }

    // 4. LAST CHUNK: Assemble all chunks into final file
    const buffers: Buffer[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const pPath = `tmp_${uploadId}_part_${i}`;
      const pRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${pPath}`, {
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
        },
      });

      if (!pRes.ok) {
        console.error(`[upload-chunk] Failed to retrieve chunk ${i} for assembly`);
        return NextResponse.json({ success: false, error: `Missing chunk ${i} during assembly` }, { status: 500 });
      }

      const pBuf = Buffer.from(await pRes.arrayBuffer());
      buffers.push(pBuf);
    }

    // Combine all chunk buffers
    const finalBuffer = Buffer.concat(buffers);
    const ext = fileName.split('.').pop() || 'mp3';
    const finalFileName = `${uploadId}.${ext}`;
    const finalContentType = chunkFile.type || 'audio/mpeg';

    // Save final combined file to Supabase Storage
    const finalUploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${finalFileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': finalContentType,
        'apikey': SERVICE_ROLE_KEY,
        'x-upsert': 'true',
      },
      body: finalBuffer,
    });

    if (!finalUploadRes.ok) {
      console.error('[upload-chunk] Failed to save final combined audio');
      return NextResponse.json({ success: false, error: 'Failed to assemble final audio file' }, { status: 500 });
    }

    // Clean up temp part files asynchronously
    for (let i = 0; i < totalChunks; i++) {
      const pPath = `tmp_${uploadId}_part_${i}`;
      fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${pPath}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
        },
      }).catch(() => {});
    }

    // Return the proxy URL that serves this file over HTTPS
    const proxyUrl = `/api/audio?path=${encodeURIComponent(finalFileName)}`;
    return NextResponse.json({ success: true, isComplete: true, url: proxyUrl });

  } catch (err: any) {
    console.error('[upload-chunk] Exception:', err);
    return NextResponse.json({ success: false, error: err.message || 'Server error' }, { status: 500 });
  }
}
