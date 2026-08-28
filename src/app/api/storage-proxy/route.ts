import { NextResponse } from 'next/server';

export const maxDuration = 60; // 60 seconds timeout limit

const DEFAULT_SECRET = Buffer.from('c2Jfc2VjcmV0X093UXpabVVfV1MyTUpaUloxb1BqdG1fWGdzeHhBNmg=', 'base64').toString('ascii');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://31.220.93.65:9000';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;
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

    // 1. Ensure audio bucket exists on Supabase VPS
    await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
    }).catch(() => {});

    // 2. Upload file Server-to-Server from Vercel to Supabase VPS
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

    if (!uploadRes.ok) {
      const errText = await uploadRes.text().catch(() => '');
      console.error('[Storage Proxy] VPS error:', uploadRes.status, errText);
      return NextResponse.json(
        { success: false, error: `VPS Storage Error (${uploadRes.status}): ${errText}` },
        { status: uploadRes.status }
      );
    }

    // 3. Return proxy audio path for secure playback over HTTPS
    const proxyUrl = `/api/audio?path=${encodeURIComponent(fileName)}`;
    return NextResponse.json({ success: true, url: proxyUrl, fileName });

  } catch (err: any) {
    console.error('[Storage Proxy Exception]', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server-to-Server upload failed' },
      { status: 500 }
    );
  }
}
