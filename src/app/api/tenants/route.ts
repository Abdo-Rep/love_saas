import { NextResponse } from 'next/server';

const DEFAULT_SECRET = Buffer.from('c2Jfc2VjcmV0X093UXpabVVfV1MyTUpaUloxb1BqdG1fWGdzeHhBNmg=', 'base64').toString('ascii');
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://31.220.93.65:9000';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SECRET;

function getHeaders(extra?: Record<string, string>) {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...extra,
  };
}

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
  };
}

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

// GET all tenants from Supabase
export async function GET() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/tenants?select=*&order=created_at.desc`,
      { headers: getHeaders(), cache: 'no-store' }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return NextResponse.json({ success: true, tenants: data.map(toApp) });
      }
    }

    const errText = await res.text().catch(() => '');
    console.error('[GET /api/tenants]', res.status, errText);
  } catch (e: any) {
    console.error('[GET /api/tenants] error:', e?.message);
  }

  return NextResponse.json({ success: true, tenants: [] });
}

// POST: upsert tenant(s) to Supabase
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const toUpsert: any[] = [];

    if (body?.tenant) {
      toUpsert.push(body.tenant);
    } else if (Array.isArray(body?.tenants)) {
      toUpsert.push(...body.tenants);
    }

    if (!toUpsert.length) {
      return NextResponse.json({ success: false, error: 'No tenant' }, { status: 400 });
    }

    const rows = toUpsert.map(toDb);
    const payload = rows.length === 1 ? rows[0] : rows;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/tenants`, {
      method: 'POST',
      headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : [data];
      return NextResponse.json({ success: true, tenants: list.map(toApp) });
    }

    const err = await res.text();
    console.error('[POST /api/tenants]', res.status, err);
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
      { method: 'DELETE', headers: getHeaders() }
    );

    if (res.ok) return NextResponse.json({ success: true });

    const err = await res.text();
    console.error('[DELETE /api/tenants]', res.status, err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500 });
  }
}
