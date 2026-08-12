import { NextResponse } from 'next/server';

const KV_URL = 'https://kvdb.io/D7L9mY2QpZ8s4VxW3nRt/love_saas_tenants_v2';

const defaultSeedTenants = [
  {
    id: 't-rawda',
    slug: 'rawda',
    name: 'نسخة روضة',
    adminPassword: 'love',
    sitePassword: 'love',
    status: 'active'
  },
  {
    id: 't-nour',
    slug: 'nour',
    name: 'نسخة نور',
    adminPassword: 'love',
    sitePassword: 'love',
    status: 'active'
  },
  {
    id: 't-asmaa',
    slug: 'asmaa',
    name: 'موقع asmaa',
    adminPassword: 'love',
    sitePassword: 'osha',
    status: 'active'
  }
];

export async function GET() {
  try {
    const res = await fetch(KV_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return NextResponse.json({ success: true, tenants: data });
      }
    }
  } catch (_) {}

  return NextResponse.json({ success: true, tenants: defaultSeedTenants });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let tenantsToSave: any[] = [];

    if (body && Array.isArray(body.tenants)) {
      tenantsToSave = body.tenants;
    } else if (body && body.tenant) {
      // Fetch current and append
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
