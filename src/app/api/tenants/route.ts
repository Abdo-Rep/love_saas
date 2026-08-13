import { NextResponse } from 'next/server';

// Global shared state for KV bucket ID across serverless invocations
let globalBucketId: string | null = null;
let memoryCache: any[] = [];

async function getBucketId(): Promise<string> {
  if (globalBucketId) return globalBucketId;
  
  try {
    const res = await fetch('https://kvdb.io/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'email=love_saas_global_cloud_v3@gmail.com'
    });
    if (res.ok) {
      const id = (await res.text()).trim();
      if (id && !id.includes('{') && id.length > 3) {
        globalBucketId = id;
        return id;
      }
    }
  } catch (_) {}

  return globalBucketId || 'DefaultBucketV3';
}

async function getCloudTenants(): Promise<any[]> {
  try {
    const bucketId = await getBucketId();
    const res = await fetch(`https://kvdb.io/${bucketId}/tenants`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        memoryCache = data;
        return data;
      }
    }
  } catch (_) {}

  // Fallback to Supabase if HTTPS
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (supabaseUrl.startsWith('https://') && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/tenants?select=*`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        cache: 'no-store'
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          memoryCache = data;
          return data;
        }
      }
    } catch (_) {}
  }

  return memoryCache;
}

async function saveCloudTenants(tenants: any[]): Promise<boolean> {
  memoryCache = tenants;
  try {
    const bucketId = await getBucketId();
    const res = await fetch(`https://kvdb.io/${bucketId}/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tenants)
    });
    if (res.ok) return true;
  } catch (_) {}

  return false;
}

export async function GET() {
  const tenants = await getCloudTenants();
  return NextResponse.json({ success: true, tenants });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let current = await getCloudTenants();

    if (body && Array.isArray(body.tenants)) {
      current = body.tenants;
    } else if (body && body.tenant) {
      const newT = body.tenant;
      const idx = current.findIndex(
        (t: any) => (t.slug || '').toLowerCase().trim() === (newT.slug || '').toLowerCase().trim()
      );
      if (idx !== -1) {
        current[idx] = newT;
      } else {
        current.unshift(newT); // Newest first!
      }
    }

    await saveCloudTenants(current);
    return NextResponse.json({ success: true, tenants: current });
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

    let current = await getCloudTenants();
    const filtered = current.filter(
      (t: any) => (t.slug || '').toLowerCase().trim() !== slugToDelete
    );

    await saveCloudTenants(filtered);
    return NextResponse.json({ success: true, tenants: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
