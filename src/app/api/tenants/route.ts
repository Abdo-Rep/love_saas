import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL = (process.env.DATABASE_URL || '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getHeaders(extra?: Record<string, string>) {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'romantic-new-version',
    'Content-Profile': 'romantic-new-version',
    'Prefer': 'resolution=merge-duplicates,return=representation',
    ...extra,
  };
}

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

function toApp(row: any) {
  const baseConfig = row.config && typeof row.config === 'object' ? row.config : {};
  
  const relationalFields: Record<string, any> = {};
  if (row.her_name) relationalFields.herName = row.her_name;
  if (row.relationship_start_date) relationalFields.relationshipStartDate = row.relationship_start_date;
  if (row.music_src) relationalFields.music_src = row.music_src;
  if (row.voice_audio_url !== undefined) relationalFields.voiceAudioUrl = row.voice_audio_url;
  if (row.voice_photo_url !== undefined) relationalFields.voicePhotoUrl = row.voice_photo_url;
  if (row.voice_message_title) relationalFields.voiceMessageTitle = row.voice_message_title;
  if (row.voice_message_subtitle) relationalFields.voiceMessageSubtitle = row.voice_message_subtitle;
  if (row.story_song_url !== undefined) relationalFields.storySongUrl = row.story_song_url;

  const adminPass = row.admin_password ?? row.adminPassword ?? baseConfig.adminPassword ?? 'love';
  const sitePass = row.site_password ?? row.sitePassword ?? baseConfig.sitePassword ?? 'love';

  const mergedConfig = {
    ...baseConfig,
    ...relationalFields,
    adminPassword: adminPass,
    sitePassword: sitePass,
  };

  return {
    id: row.id || `tenant-${row.slug}`,
    slug: row.slug,
    name: row.name,
    adminPassword: adminPass,
    sitePassword: sitePass,
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    status: row.status ?? 'active',
    config: mergedConfig,
  };
}

function toDb(t: any) {
  const cfg = t.config || {};
  const cleanSlug = (t.slug || '').toLowerCase().trim();
  const adminPass = t.adminPassword ?? t.admin_password ?? cfg.adminPassword ?? 'love';
  const sitePass = t.sitePassword ?? t.site_password ?? cfg.sitePassword ?? 'love';

  const record: Record<string, any> = {
    id: t.id || `tenant-${cleanSlug}`,
    slug: cleanSlug,
    name: t.name || `موقع ${cleanSlug}`,
    admin_password: adminPass,
    site_password: sitePass,
    status: t.status ?? 'active',
    config: {
      ...cfg,
      adminPassword: adminPass,
      sitePassword: sitePass,
    },
  };

  if (t.created_at || t.createdAt) {
    record.created_at = t.created_at || t.createdAt;
  }

  return record;
}

// GET all tenants or specific tenant by slug (100% Direct from DB - No Cache)
export async function GET(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ success: true, tenants: [] }, { headers: noCacheHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const cleanSlug = slug ? slug.toLowerCase().trim() : null;

    let endpoint = `${SUPABASE_URL}/rest/v1/tenants?select=id,slug,name,admin_password,site_password,status,created_at&order=created_at.desc`;
    if (cleanSlug) {
      endpoint = `${SUPABASE_URL}/rest/v1/tenants?slug=eq.${encodeURIComponent(cleanSlug)}&select=*`;
    }

    const res = await fetch(endpoint, {
      headers: getHeaders(),
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return NextResponse.json({ success: true, tenants: data.map(toApp) }, { headers: noCacheHeaders });
      }
    } else {
      const errText = await res.text();
      console.error('[GET /api/tenants] DB error:', res.status, errText);
    }
  } catch (e: any) {
    console.error('[GET /api/tenants] error:', e?.message);
  }

  return NextResponse.json({ success: true, tenants: [] }, { headers: noCacheHeaders });
}

// PUT / POST: Upsert tenant into Supabase DB directly
export async function PUT(req: Request) {
  return handleUpsert(req);
}

export async function POST(req: Request) {
  return handleUpsert(req);
}

async function handleUpsert(req: Request) {
  try {
    const body = await req.json();
    const toUpsert: any[] = [];

    if (body?.tenant) {
      toUpsert.push(body.tenant);
    } else if (Array.isArray(body?.tenants)) {
      toUpsert.push(...body.tenants);
    }

    if (!toUpsert.length) {
      return NextResponse.json({ success: false, error: 'No tenant provided' }, { status: 400, headers: noCacheHeaders });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ success: true, tenants: toUpsert.map(toApp) }, { headers: noCacheHeaders });
    }

    const rows = toUpsert.map(toDb);
    const payload = rows.length === 1 ? rows[0] : rows;

    const res = await fetch(`${SUPABASE_URL}/rest/v1/tenants?on_conflict=slug`, {
      method: 'POST',
      headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    if (res.ok) {
      return NextResponse.json({ success: true, tenants: toUpsert.map(toApp) }, { headers: noCacheHeaders });
    } else {
      const errText = await res.text();
      console.error('[UPSERT /api/tenants] Supabase error:', res.status, errText);
      return NextResponse.json({ success: false, error: errText }, { status: res.status, headers: noCacheHeaders });
    }
  } catch (e: any) {
    console.error('[UPSERT /api/tenants] exception:', e?.message);
    return NextResponse.json({ success: false, error: e?.message }, { status: 500, headers: noCacheHeaders });
  }
}

// PATCH: Partial update for status toggle or credentials
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const slug = (body?.slug || '').toLowerCase().trim();

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400, headers: noCacheHeaders });
    }

    const updates: Record<string, any> = {};
    if (body.status !== undefined) updates.status = body.status;
    if (body.name !== undefined) updates.name = body.name;
    if (body.adminPassword !== undefined) updates.admin_password = body.adminPassword;
    if (body.sitePassword !== undefined) updates.site_password = body.sitePassword;

    if (SUPABASE_URL && SUPABASE_KEY && Object.keys(updates).length > 0) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/tenants?slug=eq.${encodeURIComponent(slug)}`,
        {
          method: 'PATCH',
          headers: getHeaders({ 'Prefer': 'return=representation' }),
          body: JSON.stringify(updates),
          cache: 'no-store'
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        console.error('[PATCH /api/tenants] Supabase error:', res.status, errText);
        return NextResponse.json({ success: false, error: errText }, { status: res.status, headers: noCacheHeaders });
      }
    }

    return NextResponse.json({ success: true }, { headers: noCacheHeaders });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500, headers: noCacheHeaders });
  }
}

// DELETE: Hard Destroy tenant record from DB directly
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const slug = (body?.slug || '').toLowerCase().trim();

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400, headers: noCacheHeaders });
    }

    if (SUPABASE_URL && SUPABASE_KEY) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/tenants?slug=eq.${encodeURIComponent(slug)}`,
        {
          method: 'DELETE',
          headers: getHeaders({ 'Prefer': 'return=representation' }),
          cache: 'no-store'
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        console.error('[DELETE /api/tenants] Supabase error:', res.status, errText);
        return NextResponse.json({ success: false, error: errText }, { status: res.status, headers: noCacheHeaders });
      }
    }

    return NextResponse.json({ success: true, message: 'Deleted from database' }, { headers: noCacheHeaders });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500, headers: noCacheHeaders });
  }
}
