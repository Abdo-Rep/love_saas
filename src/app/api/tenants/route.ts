import { NextResponse } from 'next/server';

let bucketId: string | null = null;
let memoryCache: any[] = [];

async function getBucketId(): Promise<string> {
  if (bucketId) return bucketId;
  try {
    const res = await fetch('https://kvdb.io/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'email=love_saas_app_2026@gmail.com'
    });
    if (res.ok) {
      const id = (await res.text()).trim();
      if (id && id.length > 5 && !id.includes('<')) {
        bucketId = id;
        return id;
      }
    }
  } catch (_) {}
  return 'b8x_love_saas_2026_v1';
}

async function getTenantsFromCloud(): Promise<any[]> {
  try {
    const id = await getBucketId();
    const res = await fetch(`https://kvdb.io/${id}/tenants`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        memoryCache = data;
        return data;
      }
    }
  } catch (_) {}
  return memoryCache;
}

async function saveTenantsToCloud(tenants: any[]): Promise<void> {
  memoryCache = tenants;
  try {
    const id = await getBucketId();
    await fetch(`https://kvdb.io/${id}/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tenants)
    });
  } catch (_) {}
}

export async function GET() {
  const tenants = await getTenantsFromCloud();
  return NextResponse.json({ success: true, tenants });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let current = await getTenantsFromCloud();

    if (body && Array.isArray(body.tenants)) {
      current = body.tenants;
    } else if (body && body.tenant) {
      const t = body.tenant;
      const idx = current.findIndex(
        (item: any) => (item.slug || '').toLowerCase().trim() === (t.slug || '').toLowerCase().trim()
      );
      if (idx !== -1) {
        current[idx] = t;
      } else {
        current.unshift(t);
      }
    }

    await saveTenantsToCloud(current);
    return NextResponse.json({ success: true, tenants: current });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const slug = (body?.slug || '').toLowerCase().trim();
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
    }

    let current = await getTenantsFromCloud();
    const filtered = current.filter(
      (item: any) => (item.slug || '').toLowerCase().trim() !== slug
    );

    await saveTenantsToCloud(filtered);
    return NextResponse.json({ success: true, tenants: filtered });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
