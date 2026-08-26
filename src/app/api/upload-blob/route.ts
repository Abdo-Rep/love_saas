import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename') || `song_${Date.now()}.mp3`;

    if (!request.body) {
      return NextResponse.json({ error: 'No file body provided' }, { status: 400 });
    }

    // Upload directly to Vercel Blob storage (Supports up to 500MB)
    const blob = await put(`audio/${filename}`, request.body, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error: any) {
    console.error('[Vercel Blob Upload Error]', error);
    return NextResponse.json({ error: error.message || 'Upload to Vercel Blob failed' }, { status: 500 });
  }
}
