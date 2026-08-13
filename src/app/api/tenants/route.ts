import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function supabaseHeaders() {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };
}

// Map DB row (snake_case) → app Tenant object (camelCase)
function rowToTenant(row: any) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    adminPassword: row.adminPassword ?? row.admin_password ?? 'love',
    sitePassword: row.sitePassword ?? row.site_password ?? 'love',
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
    status: row.status ?? 'active',
    config: row.config ?? {},
    ownerEmail: row.ownerEmail ?? row.owner_email ?? '',
  };
}

// Map app Tenant object → DB row (snake_case)
function tenantToRow(t: any) {
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    admin_password: t.adminPassword ?? t.admin_password ?? 'love',
    site_password: t.sitePassword ?? t.site_password ?? 'love',
    created_at: t.createdAt ?? t.created_at ?? new Date().toISOString(),
    status: t.status ?? 'active',
    config: t.config ?? {},
  };
}

// GET all tenants
export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ success: true, tenants: [] });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tenants?select=*&order=created_at.desc`, {
      headers: supabaseHeaders(),
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return NextResponse.json({ success: true, tenants: data.map(rowToTenant) });
      }
    }
    const errText = await res.text().catch(() => 'unknown');
    console.error('Supabase GET failed:', res.status, errText);
  } catch (e) {
    console.error('Supabase GET error:', e);
  }

  return NextResponse.json({ success: true, tenants: [] });
}

// POST: upsert a single tenant or array
export async function POST(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ success: false, error: 'No DB configured' }, { status: 500 });
  }

  try {
    const body = await req.json();

    const tenantsToUpsert: any[] = [];

    if (body && body.tenant) {
      tenantsToUpsert.push(body.tenant);
    } else if (body && Array.isArray(body.tenants)) {
      tenantsToUpsert.push(...body.tenants);
    }

    if (tenantsToUpsert.length === 0) {
      return NextResponse.json({ success: false, error: 'No tenant provided' }, { status: 400 });
    }

    const rows = tenantsToUpsert.map(tenantToRow);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/tenants`, {
      method: 'POST',
      headers: {
        ...supabaseHeaders(),
        'Prefer': 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify(rows.length === 1 ? rows[0] : rows),
    });

    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : [data];
      return NextResponse.json({ success: true, tenants: list.map(rowToTenant) });
    }

    const err = await res.text();
    console.error('Supabase POST failed:', res.status, err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

// DELETE: remove a tenant by slug
export async function DELETE(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ success: false, error: 'No DB configured' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const slugToDelete = (body?.slug || '').toLowerCase().trim();

    if (!slugToDelete) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/tenants?slug=eq.${encodeURIComponent(slugToDelete)}`,
      {
        method: 'DELETE',
        headers: supabaseHeaders(),
      }
    );

    if (res.ok) {
      return NextResponse.json({ success: true });
    }

    const err = await res.text();
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
