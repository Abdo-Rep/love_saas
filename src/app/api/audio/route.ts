import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SUPABASE_REST_URL = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_STORAGE_URL = SUPABASE_REST_URL;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    if (SUPABASE_STORAGE_URL || SUPABASE_REST_URL) {
      const candidateUrls = [
        `${SUPABASE_STORAGE_URL}/storage/v1/object/public/site-media/${path}`,
        `${SUPABASE_REST_URL}/storage/v1/object/public/site-media/${path}`,
        `${SUPABASE_STORAGE_URL}/storage/v1/object/public/audio/${path}`,
      ];

      for (const fileUrl of candidateUrls) {
        if (!fileUrl.startsWith('http')) continue;
        try {
          const res = await fetch(fileUrl, {
            cache: 'no-store',
            headers: SERVICE_ROLE_KEY ? { 'Authorization': `Bearer ${SERVICE_ROLE_KEY}` } : {},
          });

          if (res.ok) {
            const contentType = res.headers.get('content-type') || 'audio/mpeg';
            const arrayBuffer = await res.arrayBuffer();
            return new NextResponse(arrayBuffer, {
              headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
              },
            });
          }
        } catch (_) {}
      }
    }

    return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Proxy Error' }, { status: 500 });
  }
}
