import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_STORAGE_KEY || '';

const SUPABASE_REST_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://31.220.93.65:8000';
const SUPABASE_STORAGE_URL = 'http://31.220.93.65:9000';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    const fileUrl = `${SUPABASE_STORAGE_URL}/object/public/site-media/${path}`;
    const res = await fetch(fileUrl, { cache: 'no-store' });

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      const contentType = res.headers.get('content-type') || 'audio/mpeg';
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return NextResponse.json({ error: 'File not found on storage' }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
