// Deprecated chunk route - replaced by direct Supabase client upload
import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ message: 'Use direct upload' });
}
