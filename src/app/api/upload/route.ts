import { NextResponse } from 'next/server';

// Allow larger payloads (Vercel Pro allows up to 50MB, Hobby is capped at 4.5MB)
export const maxDuration = 60; // seconds

const DEFAULT_SECRET = Buffer.from('c2Jfc2VjcmV0X093UXpabVVfV1MyTUpaUloxb1BqdG1fWGdzeHhBNmg=', 'base64').toString('ascii');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://31.220.93.65:8000';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;
const BUCKET = 'audio';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `song_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const contentType = file.type || 'audio/mpeg';

    // Ensure bucket exists first
    await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
    }).catch(() => {/* bucket may already exist */});

    // Upload file to Supabase Storage
    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`, {
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
      // Return public URL via our own proxy to avoid mixed content issues on client
      const publicUrl = `/api/audio?path=${encodeURIComponent(fileName)}`;
      return NextResponse.json({ success: true, url: publicUrl });
    }

    const errText = await uploadRes.text().catch(() => '');
    console.error('[Upload] Supabase storage error:', uploadRes.status, errText);

    // Fallback: try 0x0.st server-side (no CORS issue from server)
    try {
      const form = new FormData();
      const blob = new Blob([buffer], { type: contentType });
      form.append('file', blob, file.name || 'audio.mp3');
      const res = await fetch('https://0x0.st', { method: 'POST', body: form });
      if (res.ok) {
        const url = (await res.text()).trim();
        if (url.startsWith('http')) {
          return NextResponse.json({ success: true, url: url.replace('http://', 'https://') });
        }
      }
    } catch (e) {
      console.warn('[Upload] 0x0.st fallback failed:', e);
    }

    // Final fallback: catbox.moe
    try {
      const form = new FormData();
      form.append('reqtype', 'fileupload');
      const blob = new Blob([buffer], { type: contentType });
      form.append('fileToUpload', blob, file.name || 'audio.mp3');
      const res = await fetch('https://catbox.moe/d.php', { method: 'POST', body: form });
      if (res.ok) {
        const url = (await res.text()).trim();
        if (url.startsWith('http')) {
          return NextResponse.json({ success: true, url: url.replace('http://', 'https://') });
        }
      }
    } catch (e) {
      console.warn('[Upload] catbox fallback failed:', e);
    }

    return NextResponse.json({ success: false, error: 'All upload services failed' }, { status: 500 });
  } catch (err: any) {
    console.error('[API Upload] Fatal error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
