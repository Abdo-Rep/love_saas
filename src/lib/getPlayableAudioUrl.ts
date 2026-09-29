export function getPlayableAudioUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Return direct audio URLs (data, blob, http, https, local static files) directly to prevent proxy bandwidth
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  return trimmed;
}
