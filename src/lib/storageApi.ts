// Direct Supabase Storage client helper (bypasses any intermediate backend)

const SUPABASE_STORAGE_URL = (
  import.meta.env?.VITE_DATABASE_URL ||
  import.meta.env?.VITE_SUPABASE_URL ||
  'http://31.220.93.65:8000'
).replace(/\/$/, '');

const SERVICE_ROLE_KEY =
  import.meta.env?.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  '';

const BUCKET = 'site-media';

export async function uploadFileToSupabaseStorage(
  file: File,
  category: 'music' | 'voice' | 'gallery' = 'gallery',
  slug: string = 'default'
): Promise<string> {
  const ext = file.name.split('.').pop() || (category === 'gallery' ? 'webp' : 'mp3');
  const fileName = `${category}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;
  const path = `${slug}/${fileName}`;

  if (SUPABASE_STORAGE_URL && SERVICE_ROLE_KEY) {
    try {
      // 1. Try uploading to slug/fileName in bucket
      const uploadUrl = `${SUPABASE_STORAGE_URL}/storage/v1/object/${BUCKET}/${path}`;
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          apikey: SERVICE_ROLE_KEY,
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'true',
        },
        body: file,
      });

      if (res.ok) {
        return `${SUPABASE_STORAGE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
      }

      // 2. Try root bucket upload fallback
      const rootUrl = `${SUPABASE_STORAGE_URL}/storage/v1/object/${BUCKET}/${fileName}`;
      const rootRes = await fetch(rootUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          apikey: SERVICE_ROLE_KEY,
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'true',
        },
        body: file,
      });

      if (rootRes.ok) {
        return `${SUPABASE_STORAGE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
      }
    } catch (e) {
      console.warn('[StorageApi] Direct upload error:', e);
    }
  }

  // Fallback: Read file as Data URL
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
