import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a new FormData for Catbox
    const catboxForm = new FormData();
    catboxForm.append('reqtype', 'fileupload');
    
    // Append the file as a Blob/File
    const blob = new Blob([buffer], { type: file.type });
    catboxForm.append('fileToUpload', blob, file.name);

    // POST to Catbox server-side (bypasses CORS restrictions)
    const res = await fetch('https://catbox.moe/d.php', {
      method: 'POST',
      body: catboxForm,
    });

    if (res.ok) {
      const fileUrl = await res.text();
      if (fileUrl.startsWith('http')) {
        return NextResponse.json({ success: true, url: fileUrl.trim() });
      }
    }

    const errText = await res.text().catch(() => '');
    console.error('[API Upload] Catbox failed:', res.status, errText);
    return NextResponse.json({ success: false, error: 'Failed to upload file to permanent host' }, { status: 500 });
  } catch (err: any) {
    console.error('[API Upload] Error:', err);
    return NextResponse.json({ success: false, error: err?.message || 'Internal server error' }, { status: 500 });
  }
}
