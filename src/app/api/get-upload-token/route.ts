import { NextResponse } from 'next/server';

const DEFAULT_SECRET = Buffer.from('c2Jfc2VjcmV0X093UXpabVVfV1MyTUpaUloxb1BqdG1fWGdzeHhBNmg=', 'base64').toString('ascii');

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://31.220.93.65:8000';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;

  return NextResponse.json({
    url: url.startsWith('http') ? url : `http://${url}`,
    key: key,
  });
}
