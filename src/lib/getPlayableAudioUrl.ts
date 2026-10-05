import { getSupabaseUrl } from './supabaseClient';

export function getPlayableAudioUrl(url: string): string {
  if (!url) return '';
  let trimmed = url.trim();
  if (!trimmed) return '';

  const supabaseUrl = getSupabaseUrl();

  // If on HTTPS and url points to self-hosted HTTP server, convert to same origin proxy
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    trimmed = trimmed.replace(/^http:\/\/31\.220\.93\.65:8000/, window.location.origin);
  }

  // 1. Data URLs and blobs are always direct and self-contained
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // 2. Full HTTP / HTTPS external URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return encodeURI(decodeURI(trimmed));
  }

  // 3. If it was stored as legacy /api/audio?path=... convert to direct Supabase Storage public URL
  if (trimmed.startsWith('/api/audio')) {
    const searchPart = trimmed.split('?')[1] || '';
    const params = new URLSearchParams(searchPart);
    const path = params.get('path') || '';
    if (path) {
      const cleanPath = decodeURIComponent(path).replace(/^\/+/, '');
      if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
        return cleanPath;
      }
      return `${supabaseUrl}/storage/v1/object/public/site-media/${cleanPath}`;
    }
  }

  // 4. Static local sound files (/sound/...)
  if (trimmed.startsWith('/sound/') || trimmed.startsWith('sound/')) {
    const cleanSound = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return encodeURI(decodeURI(cleanSound));
  }

  // 5. Bare storage filenames (e.g. music-1234.mp3 or zyad-hana/music-123.mp3)
  const cleanBare = trimmed.replace(/^\/+/, '');
  return `${supabaseUrl}/storage/v1/object/public/site-media/${cleanBare}`;
}

