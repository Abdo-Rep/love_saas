export function getPlayableAudioUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  if (url.startsWith('/api/audio')) return url;

  // Convert storage URLs to HTTPS proxy URL /api/audio?path=...
  if (url.includes('storage/v1/object/public/site-media/')) {
    const relativePath = url.split('/storage/v1/object/public/site-media/')[1];
    return `/api/audio?path=${encodeURIComponent(relativePath)}`;
  }
  if (url.includes('storage/v1/object/site-media/')) {
    const relativePath = url.split('/storage/v1/object/site-media/')[1];
    return `/api/audio?path=${encodeURIComponent(relativePath)}`;
  }
  if (url.includes('storage/v1/object/public/audio/')) {
    const relativePath = url.split('/storage/v1/object/public/audio/')[1];
    return `/api/audio?path=${encodeURIComponent(relativePath)}`;
  }
  if (url.includes('storage/v1/object/audio/')) {
    const relativePath = url.split('/storage/v1/object/audio/')[1];
    return `/api/audio?path=${encodeURIComponent(relativePath)}`;
  }

  return url;
}
