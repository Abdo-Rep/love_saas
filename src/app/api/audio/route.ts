import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SUPABASE_REST_URL = (process.env.DATABASE_URL || '').replace(/\/$/, '');

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    const cleanPath = path.replace(/^\/+/, '');

    if (SUPABASE_REST_URL) {
      // Direct redirect to public Supabase Storage CDN to prevent Vercel Fast Origin Transfer
      const directUrl = `${SUPABASE_REST_URL}/storage/v1/object/public/site-media/${encodeURIComponent(cleanPath).replace(/%2F/g, '/')}`;
      return NextResponse.redirect(directUrl, {
        status: 307,
        headers: {
          'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
          'CDN-Cache-Control': 'public, s-maxage=31536000, immutable',
        },
      });
    }

    return NextResponse.json({ error: 'Audio storage not configured' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Proxy Error' }, { status: 500 });
  }
}
