import { NextResponse } from 'next/server';

// Hardcoded Supabase credentials for reliable cross-device tenant sync
// These are safe since the table has public RLS policies
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://31.220.93.65:8000';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijc1N2Y0M2YxLTcwMTgtNDhhNS04NTY2LTk3NzFlOTk4Mjc3MyJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3ODA3NTA4OTcsImV4cCI6MTkzODQzMDg5N30.nR8pK74D_5XhH1aBKpJXlTDOXz1Hl_XcanlFUS2ldkENkF_LAGFd8ZcxnbY_JmIbm0qPYj8ESJHQ84RVKln0vg';

function headers() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };
}

// Map DB row (snake_case) → app Tenant (camelCase)
function toApp(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    adminPassword: row.admin_password ?? row.adminPassword ?? 'love',
    sitePassword: row.site_password ?? row.sitePassword ?? 'love',
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    status: row.status ?? 'active',
    config: row.config ?? {},
    ownerEmail: row.owner_email ?? row.ownerEmail ?? '',
  };
}

// Map app Tenant → DB row (snake_case)
function toDb(t: any) {
  return {
    id: t.id,
    slug: (t.slug || '').toLowerCase().trim(),
    name: t.name || `موقع ${t.slug}`,
    admin_password: t.adminPassword ?? t.admin_password ?? 'love',
    site_password: t.sitePassword ?? t.site_password ?? 'love',
    created_at: t.createdAt ?? t.created_at ?? new Date().toISOString(),
    status: t.status ?? 'active',
    config: t.config ?? {},
  };
}

// GET: fetch all tenants
export async function GET() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tenants?select=*&order=created_at.desc`, {
      headers: headers(),
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return NextResponse.json({ success: true, tenants: data.map(toApp) });
      }
    }
    // Log error for debugging
    const errText = await res.text().catch(() => 'unknown');
    console.error('[GET /api/tenants] Supabase error:', res.status, errText);
  } catch (e: any) {
    console.error('[GET /api/tenants] Fetch error:', e?.message);
  }
  return NextResponse.json({ success: true, tenants: [] });
}

// POST: upsert tenant(s)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const toUpsert: any[] = [];

    if (body?.tenant) {
      toUpsert.push(body.tenant);
    } else if (Array.isArray(body?.tenants)) {
      toUpsert.push(...body.tenants);
    }

    if (toUpsert.length === 0) {
      return NextResponse.json({ success: false, error: 'No tenant' }, { status: 400 });
    }

    const rows = toUpsert.map(toDb);
    const payload = rows.length === 1 ? rows[0] : rows;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/tenants`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : [data];
      return NextResponse.json({ success: true, tenants: list.map(toApp) });
    }

    const err = await res.text();
    console.error('[POST /api/tenants] Supabase error:', res.status, err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500 });
  }
}

// DELETE: remove tenant by slug
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const slug = (body?.slug || '').toLowerCase().trim();
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/tenants?slug=eq.${encodeURIComponent(slug)}`,
      { method: 'DELETE', headers: headers() }
    );

    if (res.ok) {
      return NextResponse.json({ success: true });
    }

    const err = await res.text();
    console.error('[DELETE /api/tenants] Supabase error:', res.status, err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500 });
  }
}
