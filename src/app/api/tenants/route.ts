import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.DATABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// High-Performance Server Cache
const apiCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 15000; // 15 seconds cache TTL for ultra-fast queries

function getHeaders(extra?: Record<string, string>) {
  return {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates,return=representation',
    ...extra,
  };
}

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

  const mergedConfig = {
    ...baseConfig,
    ...relationalFields,
  };

  return {
    id: row.id || `tenant-${row.slug}`,
    slug: row.slug,
    name: row.name,
    adminPassword: row.admin_password ?? row.adminPassword ?? 'love',
    sitePassword: row.site_password ?? row.sitePassword ?? 'love',
    createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
    status: row.status ?? 'active',
    config: mergedConfig,
  };
}

function toDb(t: any) {
  const cfg = t.config || {};
  const cleanSlug = (t.slug || '').toLowerCase().trim();

  return {
    id: t.id || `tenant-${cleanSlug}`,
    slug: cleanSlug,
    name: t.name || `موقع ${cleanSlug}`,
    admin_password: t.adminPassword ?? t.admin_password ?? 'love',
    site_password: t.sitePassword ?? t.site_password ?? 'love',
    created_at: t.createdAt ?? t.created_at ?? new Date().toISOString(),
    status: t.status ?? 'active',
    config: cfg,
  };
}

// GET all tenants or specific tenant by slug (Ultra-fast cached response)
export async function GET(req: Request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ success: true, tenants: [] });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const cleanSlug = slug ? slug.toLowerCase().trim() : null;
    const cacheKey = cleanSlug ? `slug_${cleanSlug}` : 'all';

    // 1. Check Server Memory Cache for Instant Response (1ms latency)
    const cached = apiCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      return NextResponse.json(cached.data);
    }

    let endpoint = `${SUPABASE_URL}/rest/v1/tenants?select=*&order=created_at.desc`;
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
        const responseData = { success: true, tenants: data.map(toApp) };
        apiCache.set(cacheKey, { timestamp: Date.now(), data: responseData });
        return NextResponse.json(responseData);
      }
    }
  } catch (e: any) {
    console.error('[GET /api/tenants] error:', e?.message);
  }

  return NextResponse.json({ success: true, tenants: [] });
}

// POST: upsert tenant(s) to Supabase Cloud DB & invalidate cache
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
      return NextResponse.json({ success: false, error: 'No tenant provided' }, { status: 400 });
    }

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return NextResponse.json({ success: true, tenants: toUpsert.map(toApp) });
    }

    const rows = toUpsert.map(toDb);
    const payload = rows.length === 1 ? rows[0] : rows;

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/tenants?on_conflict=slug`, {
        method: 'POST',
        headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates,return=representation' }),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [data];
        // Invalidate Server Memory Cache on Save
        apiCache.clear();
        return NextResponse.json({ success: true, tenants: list.map(toApp) });
      } else {
        const errText = await res.text();
        console.error('[POST /api/tenants] Supabase error:', res.status, errText);
      }
    } catch (err: any) {
      console.error('[POST /api/tenants] fetch error:', err?.message);
    }

    // Invalidate Server Memory Cache
    apiCache.clear();
    return NextResponse.json({ success: true, tenants: toUpsert.map(toApp) });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500 });
  }
}

// DELETE: remove tenant by slug & invalidate cache
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const slug = (body?.slug || '').toLowerCase().trim();

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
    }

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        await fetch(
          `${SUPABASE_URL}/rest/v1/tenants?slug=eq.${encodeURIComponent(slug)}`,
          { method: 'DELETE', headers: getHeaders() }
        );
      } catch (_) { }
    }

    // Invalidate Server Memory Cache on Delete
    apiCache.clear();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message }, { status: 500 });
  }
}
