import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Return immediate cached 204 No Content for legacy /api/media to eliminate FOT & compute
export async function GET() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      'CDN-Cache-Control': 'public, s-maxage=31536000, immutable',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=31536000, immutable',
    },
  });
}

export async function POST() {
  return new NextResponse(null, { status: 204 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    },
  });
}
