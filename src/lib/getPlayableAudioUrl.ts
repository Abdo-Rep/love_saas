export function getPlayableAudioUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // 1. Data URLs and blobs are always direct and self-contained
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // 2. Already pointing to our audio proxy
  if (trimmed.startsWith('/api/audio')) {
    return trimmed;
  }

  // 3. Convert any Supabase Storage URLs to HTTPS proxy URL /api/audio?path=...
  if (trimmed.includes('/storage/v1/object/public/site-media/')) {
    const relativePath = trimmed.split('/storage/v1/object/public/site-media/')[1];
    return `/api/audio?path=${encodeURIComponent(relativePath.split('?')[0])}`;
  }
  if (trimmed.includes('/storage/v1/object/site-media/')) {
    const relativePath = trimmed.split('/storage/v1/object/site-media/')[1];
    return `/api/audio?path=${encodeURIComponent(relativePath.split('?')[0])}`;
  }
  if (trimmed.includes('/storage/v1/object/public/audio/')) {
    const relativePath = trimmed.split('/storage/v1/object/public/audio/')[1];
    return `/api/audio?path=${encodeURIComponent(relativePath.split('?')[0])}`;
  }
  if (trimmed.includes('/storage/v1/object/audio/')) {
    const relativePath = trimmed.split('/storage/v1/object/audio/')[1];
    return `/api/audio?path=${encodeURIComponent(relativePath.split('?')[0])}`;
  }

  // Handle port 9000 or raw IP storage URLs (e.g. http://31.220.93.65:9000/storage/...)
  if (trimmed.includes(':9000/') || trimmed.includes('/storage/v1/object/')) {
    const match = trimmed.match(/\/storage\/v1\/object\/(?:public\/)?(?:[^\/]+\/)(.+)$/);
    if (match && match[1]) {
      return `/api/audio?path=${encodeURIComponent(match[1].split('?')[0])}`;
    }
  }

  // 4. Return direct audio URLs (local static files or external HTTPS) directly (properly URI-encoded)
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return encodeURI(decodeURI(trimmed));
  }

  return encodeURI(decodeURI(trimmed));
}
