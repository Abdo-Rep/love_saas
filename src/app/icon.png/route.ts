import { NextResponse } from 'next/server';

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
    <rect width="192" height="192" rx="40" fill="#090108"/>
    <circle cx="96" cy="96" r="70" fill="url(#grad)"/>
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f43f5e" />
        <stop offset="50%" stop-color="#ec4899" />
        <stop offset="100%" stop-color="#fbbf24" />
      </linearGradient>
    </defs>
    <path d="M56 128h80v12H56zm0-16h80l8-40-28 20-20-32-20 32-28-20z" fill="#ffffff"/>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
