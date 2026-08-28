import { NextResponse } from 'next/server';

const SUPABASE_REST_URL = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_STORAGE_URL = SUPABASE_REST_URL;
const BUCKET = 'site-media';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'music';

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

    if (SUPABASE_REST_URL && SUPABASE_STORAGE_URL && SERVICE_ROLE_KEY) {
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

        for (const host of [SUPABASE_STORAGE_URL, SUPABASE_REST_URL]) {
          try {
            const res = await fetch(`${host}/storage/v1/object/${BUCKET}/${fileName}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'apikey': SERVICE_ROLE_KEY,
                'Content-Type': contentType,
                'x-upsert': 'true',
              },
              body: buffer,
            });

            if (res.ok) {
              const publicUrl = `${host}/storage/v1/object/public/${BUCKET}/${fileName}`;
              return NextResponse.json({
                success: true,
                url: publicUrl,
                proxyUrl: `/api/audio?path=${encodeURIComponent(fileName)}`,
                isComplete: true,
              });
            }
          } catch (_) {}
        }
      } else {
        // Multi-chunk upload handling
        const ext = file.name.split('.').pop() || 'mp3';
        const finalFileName = `${category}-${uploadId}.${ext}`;
        const chunkPath = `chunks/${uploadId}_chunk_${chunkIndex}`;

        for (const host of [SUPABASE_STORAGE_URL, SUPABASE_REST_URL]) {
          try {
            await fetch(`${host}/storage/v1/object/${BUCKET}/${chunkPath}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'apikey': SERVICE_ROLE_KEY,
                'Content-Type': 'application/octet-stream',
                'x-upsert': 'true',
              },
              body: buffer,
            });
          } catch (_) {}
        }

        if (chunkIndex === totalChunks - 1) {
          const combinedChunks: Buffer[] = [];
          for (let i = 0; i < totalChunks; i++) {
            const cPath = `chunks/${uploadId}_chunk_${i}`;
            let chunkBuf: Buffer | null = null;

            for (const host of [SUPABASE_STORAGE_URL, SUPABASE_REST_URL]) {
              try {
                const cRes = await fetch(`${host}/storage/v1/object/${BUCKET}/${cPath}`, {
                  headers: { 'Authorization': `Bearer ${SERVICE_ROLE_KEY}`, 'apikey': SERVICE_ROLE_KEY },
                });
                if (cRes.ok) {
                  chunkBuf = Buffer.from(await cRes.arrayBuffer());
                  break;
                }
              } catch (_) {}
            }
            if (chunkBuf) combinedChunks.push(chunkBuf);
          }

          if (combinedChunks.length > 0) {
            const fullFile = Buffer.concat(combinedChunks);

            for (const host of [SUPABASE_STORAGE_URL, SUPABASE_REST_URL]) {
              try {
                const upRes = await fetch(`${host}/storage/v1/object/${BUCKET}/${finalFileName}`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                    'apikey': SERVICE_ROLE_KEY,
                    'Content-Type': contentType,
                    'x-upsert': 'true',
                  },
                  body: fullFile,
                });

                if (upRes.ok) {
                  return NextResponse.json({
                    success: true,
                    url: `${host}/storage/v1/object/public/${BUCKET}/${finalFileName}`,
                    proxyUrl: `/api/audio?path=${encodeURIComponent(finalFileName)}`,
                    isComplete: true,
                  });
                }
              } catch (_) {}
            }
          }
        } else {
          return NextResponse.json({
            success: true,
            isComplete: false,
            chunkIndex,
            totalChunks,
          });
        }
      }
    }

    // Data URL fallback if no cloud DB configured
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${contentType};base64,${base64Data}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      proxyUrl: dataUrl,
      isComplete: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server upload error' },
      { status: 500 }
    );
  }
}
