import { NextResponse } from 'next/server';

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="100" fill="#090108"/>
    <circle cx="256" cy="256" r="190" fill="url(#grad)"/>
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f43f5e" />
        <stop offset="50%" stop-color="#ec4899" />
        <stop offset="100%" stop-color="#fbbf24" />
      </linearGradient>
    </defs>
    <path d="M140 340h232v32H140zm0-40h232l24-110-80 56-56-90-56 90-80-56z" fill="#ffffff"/>
  </svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
