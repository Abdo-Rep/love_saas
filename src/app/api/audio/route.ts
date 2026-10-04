import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SUPABASE_REST_URL = (process.env.DATABASE_URL || process.env.SUPABASE_URL || 'http://31.220.93.65:8000').replace(/\/$/, '');
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

interface CachedAudio {
  buffer: Buffer;
  contentType: string;
  timestamp: number;
}

// In-memory cache for ultra-fast streaming & Range requests (15 min TTL)
const audioCache = new Map<string, CachedAudio>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function serveAudioBuffer(req: Request, buffer: Buffer, contentType: string) {
  const totalLength = buffer.length;
  const rangeHeader = req.headers.get('range');

  if (rangeHeader && rangeHeader.startsWith('bytes=')) {
    const parts = rangeHeader.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : totalLength - 1;

    if (!isNaN(start) && start < totalLength) {
      const chunkEnd = Math.min(end, totalLength - 1);
      const chunkSize = chunkEnd - start + 1;
      const chunk = buffer.subarray(start, chunkEnd + 1);

      return new NextResponse(new Uint8Array(chunk), {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${chunkEnd}/${totalLength}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  }

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Length': totalLength.toString(),
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function resolveContentType(cleanPath: string, rawContentType: string | null): string {
  if (rawContentType && rawContentType !== 'application/octet-stream' && rawContentType !== 'text/plain') {
    return rawContentType;
  }
  const ext = cleanPath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp3':
      return 'audio/mpeg';
    case 'webm':
      return 'audio/webm';
    case 'opus':
      return 'audio/ogg; codecs=opus';
    case 'mp4':
    case 'm4a':
      return 'audio/mp4';
    case 'ogg':
      return 'audio/ogg';
    case 'wav':
      return 'audio/wav';
    default:
      return 'audio/mpeg';
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    if (!path) {
      return NextResponse.json({ error: 'Missing path' }, { status: 400 });
    }

    const cleanPath = decodeURIComponent(path).replace(/^\/+/, '');

    // 1. Check in-memory cache (serves seeks & range requests in 0ms)
    const cached = audioCache.get(cleanPath);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return serveAudioBuffer(req, cached.buffer, cached.contentType);
    }

    if (!SUPABASE_REST_URL) {
      return NextResponse.json({ error: 'Audio storage not configured' }, { status: 404 });
    }

    const fileName = cleanPath.split('/').pop() || cleanPath;

    const candidateUrls = [
      `${SUPABASE_REST_URL}/storage/v1/object/public/site-media/${cleanPath}`,
      `${SUPABASE_REST_URL}/storage/v1/object/site-media/${cleanPath}`,
      `${SUPABASE_REST_URL}/storage/v1/object/authenticated/site-media/${cleanPath}`,
      `${SUPABASE_REST_URL}/storage/v1/object/public/site-media/soulove/music/${fileName}`,
      `${SUPABASE_REST_URL}/storage/v1/object/public/site-media/music/${fileName}`,
      `${SUPABASE_REST_URL}/storage/v1/object/public/site-media/voice/${fileName}`,
      `${SUPABASE_REST_URL}/storage/v1/object/public/audio/${cleanPath}`,
      `${SUPABASE_REST_URL}/storage/v1/object/audio/${cleanPath}`,
    ];

    const fetchHeaders: Record<string, string> = {};
    if (SERVICE_ROLE_KEY) {
      fetchHeaders['Authorization'] = `Bearer ${SERVICE_ROLE_KEY}`;
      fetchHeaders['apikey'] = SERVICE_ROLE_KEY;
    }

    for (const fileUrl of candidateUrls) {
      if (!fileUrl.startsWith('http')) continue;
      try {
        const res = await fetch(fileUrl, {
          cache: 'no-store',
          headers: fetchHeaders,
        });

        if (res.ok) {
          const contentType = resolveContentType(fileName, res.headers.get('content-type'));
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          audioCache.set(cleanPath, {
            buffer,
            contentType,
            timestamp: Date.now(),
          });

          return serveAudioBuffer(req, buffer, contentType);
        }
      } catch (_) {}
    }

    // Fallback 1: search subfolders dynamically in site-media
    try {
      const listRes = await fetch(`${SUPABASE_REST_URL}/storage/v1/object/list/site-media`, {
        method: 'POST',
        headers: { ...fetchHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix: '', limit: 100 }),
        cache: 'no-store',
      });
      if (listRes.ok) {
        const folders = (await listRes.json()).filter((i: any) => i.name && !i.name.includes('.'));
        for (const f of folders) {
          for (const sub of ['music', 'voice', 'memories', 'gallery', '']) {
            const relPath = `${f.name}${sub ? '/' + sub : ''}/${fileName}`;
            const subUrl = `${SUPABASE_REST_URL}/storage/v1/object/public/site-media/${relPath}`;
            try {
              const sRes = await fetch(subUrl, { cache: 'no-store', headers: fetchHeaders });
              if (sRes.ok) {
                const contentType = resolveContentType(fileName, sRes.headers.get('content-type'));
                const arrayBuffer = await sRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                audioCache.set(cleanPath, {
                  buffer,
                  contentType,
                  timestamp: Date.now(),
                });

                return serveAudioBuffer(req, buffer, contentType);
              }
            } catch (_) {}
          }
        }
      }
    } catch (_) {}

    // Fallback 2: If a legacy/migrated audio file is missing, serve the default romantic song from storage
    const defaultFallbackUrls = [
      `${SUPABASE_REST_URL}/storage/v1/object/public/site-media/music-up_1791135914106_ci7do.mp3`,
      `${SUPABASE_REST_URL}/storage/v1/object/public/site-media/music-up_1791099296337_p4wx7.mp3`,
      `${SUPABASE_REST_URL}/storage/v1/object/public/site-media/music-1791142908035.m4a`,
    ];

    for (const fallbackUrl of defaultFallbackUrls) {
      try {
        const fbRes = await fetch(fallbackUrl, { cache: 'no-store', headers: fetchHeaders });
        if (fbRes.ok) {
          const contentType = resolveContentType(fallbackUrl, fbRes.headers.get('content-type'));
          const arrayBuffer = await fbRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          audioCache.set(cleanPath, {
            buffer,
            contentType,
            timestamp: Date.now(),
          });

          return serveAudioBuffer(req, buffer, contentType);
        }
      } catch (_) {}
    }

    return NextResponse.json({ error: 'Audio file not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Proxy Error' }, { status: 500 });
  }
}

export async function HEAD(req: Request) {
  return GET(req);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization',
    },
  });
}
