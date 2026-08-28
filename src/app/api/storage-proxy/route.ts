import { NextResponse } from 'next/server';

export const maxDuration = 60;

const SUPABASE_URL = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const BUCKET = 'audio';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const ext = file.name.split('.').pop() || 'mp3';
    const fileName = `song_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    if (SUPABASE_URL && SERVICE_ROLE_KEY) {
      // 1. Ensure audio bucket exists
      await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
      }).catch(() => {});

      // 2. Upload to storage
      const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Content-Type': file.type || 'audio/mpeg',
          'x-upsert': 'true',
        },
        body: fileBuffer,
      });

      if (uploadRes.ok) {
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
        return NextResponse.json({
          success: true,
          url: publicUrl,
          proxyUrl: `/api/audio?path=${encodeURIComponent(fileName)}`,
          fileName,
        });
      }
    }

    // Fallback Data URL
    const base64 = fileBuffer.toString('base64');
    const dataUrl = `data:${file.type || 'audio/mpeg'};base64,${base64}`;
    return NextResponse.json({
      success: true,
      url: dataUrl,
      proxyUrl: dataUrl,
      fileName,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
