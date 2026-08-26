import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailInput = (body?.email || '').trim().toLowerCase();
    const passwordInput = (body?.password || '').trim();

    const envEmail = (process.env.SUPER_ADMIN_EMAIL || 'admin@cosmiclove.com').trim().toLowerCase();
    const envPassword = (process.env.SUPER_ADMIN_PASSWORD || 'admin123').trim();

    if (!emailInput || !passwordInput) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال البريد الإلكتروني وكلمة السر ❌' }, { status: 400 });
    }

    if (emailInput === envEmail && passwordInput === envPassword) {
      return NextResponse.json({ success: true, message: 'تم تسجيل الدخول بنجاح' });
    }

    return NextResponse.json({ success: false, error: 'البريد الإلكتروني أو كلمة السر غير صحيحة ❌' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'خطأ في السيرفر' }, { status: 500 });
  }
}
