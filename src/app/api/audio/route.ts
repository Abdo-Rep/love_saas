import { NextResponse } from 'next/server';

const DEFAULT_SECRET = Buffer.from('c2Jfc2VjcmV0X093UXpabVVfV1MyTUpaUloxb1BqdG1fWGdzeHhBNmg=', 'base64').toString('ascii');
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;

const SUPABASE_REST_URL = 'http://31.220.93.65:8000';
const SUPABASE_STORAGE_URL = 'http://31.220.93.65:9000';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    if (!path) {
      return new NextResponse('Missing path', { status: 400 });
    }

    // Try fetching from site-media bucket, then audio bucket, across ports 9000 and 8000
    const buckets = ['site-media', 'audio'];
    const hosts = [SUPABASE_STORAGE_URL, SUPABASE_REST_URL];

    let audioBuffer: ArrayBuffer | null = null;
    let contentType = 'audio/mpeg';

    for (const host of hosts) {
      for (const bucket of buckets) {
        try {
          const res = await fetch(`${host}/storage/v1/object/${bucket}/${path}`, {
            headers: {
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'apikey': SERVICE_ROLE_KEY,
            },
          });

          if (res.ok) {
            contentType = res.headers.get('content-type') || 'audio/mpeg';
            audioBuffer = await res.arrayBuffer();
            break;
          }
        } catch (_) {}
      }
      if (audioBuffer) break;
    }

    if (!audioBuffer) {
      return new NextResponse('Audio not found', { status: 404 });
    }

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': audioBuffer.byteLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    console.error('[API Audio Proxy] Error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}
