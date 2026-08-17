import { NextResponse } from 'next/server';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(':8000', ':9000');
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// POST /api/save-audio-chunk
// Body (JSON): { tenantId, slug, part: 1|2|3, data: base64chunk }
export async function POST(req: Request) {
  try {
    const { tenantId, slug, part, data } = await req.json();
    if (!slug || !part || data === undefined) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Map part number to config field name
    const fieldMap: Record<number, string> = {
      1: 'storySongUrl',
      2: 'storySongPart2',
      3: 'storySongPart3',
    };
    const field = fieldMap[part];
    if (!field) {
      return NextResponse.json({ success: false, error: 'Invalid part number' }, { status: 400 });
    }

    // Update only the specific audio chunk field in Supabase config JSONB
    const filter = tenantId ? `id=eq.${tenantId}` : `slug=eq.${encodeURIComponent(slug)}`;
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/tenants?${filter}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          config: { [field]: data },
        }),
      }
    );

    if (!res.ok) {
      // Fallback: use jsonb_set approach via RPC or direct update
      const textErr = await res.text().catch(() => '');
      console.error('[save-audio-chunk] Supabase PATCH error:', res.status, textErr);
      
      // Try alternative: fetch current config, merge, then update
      const getRes = await fetch(
        `${SUPABASE_URL}/rest/v1/tenants?${filter}&select=id,config`,
        {
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'apikey': SERVICE_ROLE_KEY,
          },
        }
      );
      if (getRes.ok) {
        const rows = await getRes.json();
        if (rows && rows.length > 0) {
          const currentConfig = rows[0].config || {};
          const mergedConfig = { ...currentConfig, [field]: data };
          const updateRes = await fetch(
            `${SUPABASE_URL}/rest/v1/tenants?${filter}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'apikey': SERVICE_ROLE_KEY,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
              },
              body: JSON.stringify({ config: mergedConfig }),
            }
          );
          if (updateRes.ok) {
            return NextResponse.json({ success: true });
          }
        }
      }
      return NextResponse.json({ success: false, error: 'Failed to save chunk' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[save-audio-chunk] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
