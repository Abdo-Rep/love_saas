import { getSupabaseUrl, getSupabaseKey } from './supabaseClient';

// Direct Supabase Storage client helper (bypasses any intermediate backend)
const BUCKET = 'site-media';


export async function uploadFileToSupabaseStorage(
  file: File,
  category: 'music' | 'voice' | 'gallery' = 'gallery',
  slug: string = 'default'
): Promise<string> {
  const ext = file.name.split('.').pop() || (category === 'gallery' ? 'webp' : 'mp3');
  const fileName = `${category}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${ext}`;
  const path = `${slug}/${fileName}`;

  const supabaseStorageUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseKey();

  if (supabaseStorageUrl && serviceRoleKey) {
    try {
      // 1. Try uploading to slug/fileName in bucket
      const uploadUrl = `${supabaseStorageUrl}/storage/v1/object/${BUCKET}/${path}`;
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'true',
        },
        body: file,
      });

      if (res.ok) {
        return `${supabaseStorageUrl}/storage/v1/object/public/${BUCKET}/${path}`;
      }

      // 2. Try root bucket upload fallback
      const rootUrl = `${supabaseStorageUrl}/storage/v1/object/${BUCKET}/${fileName}`;
      const rootRes = await fetch(rootUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'true',
        },
        body: file,
      });

      if (rootRes.ok) {
        return `${supabaseStorageUrl}/storage/v1/object/public/${BUCKET}/${fileName}`;
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
