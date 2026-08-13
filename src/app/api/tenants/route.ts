import { NextResponse } from 'next/server';

const KV_URL = 'https://kvdb.io/D7L9mY2QpZ8s4VxW3nRt/love_saas_tenants_v3';

export async function GET() {
  try {
    const res = await fetch(KV_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return NextResponse.json({ success: true, tenants: data });
      }
    }
  } catch (_) {}

  return NextResponse.json({ success: true, tenants: [] });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let tenantsToSave: any[] = [];

    if (body && Array.isArray(body.tenants)) {
      tenantsToSave = body.tenants;
    } else if (body && body.tenant) {
      let current: any[] = [];
      try {
        const res = await fetch(KV_URL, { cache: 'no-store' });
        if (res.ok) current = await res.json();
      } catch (_) {}

      const idx = current.findIndex(
        (t: any) => t.slug.toLowerCase() === body.tenant.slug.toLowerCase()
      );
      if (idx !== -1) {
        current[idx] = body.tenant;
      } else {
        current.push(body.tenant);
      }
      tenantsToSave = current;
    }

    // Save to global Cloud KV
    try {
      await fetch(KV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenantsToSave)
      });
    } catch (_) {}

    return NextResponse.json({ success: true, tenants: tenantsToSave });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const slugToDelete = (body?.slug || '').toLowerCase().trim();
    if (!slugToDelete) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    let current: any[] = [];
    try {
      const res = await fetch(KV_URL, { cache: 'no-store' });
      if (res.ok) current = await res.json();
    } catch (_) {}

    const filtered = current.filter((t: any) => (t.slug || '').toLowerCase().trim() !== slugToDelete);

    try {
      await fetch(KV_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filtered)
      });
    } catch (_) {}

    return NextResponse.json({ success: true, tenants: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
