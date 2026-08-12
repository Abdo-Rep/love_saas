import { NextResponse } from 'next/server';

// Server-side in-memory shared store for cross-device synchronization
let globalTenantsStore: any[] = [];

export async function GET() {
  return NextResponse.json({ success: true, tenants: globalTenantsStore });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body && Array.isArray(body.tenants)) {
      globalTenantsStore = body.tenants;
      return NextResponse.json({ success: true, tenants: globalTenantsStore });
    }
    if (body && body.tenant) {
      const idx = globalTenantsStore.findIndex(
        (t) => t.slug.toLowerCase() === body.tenant.slug.toLowerCase()
      );
      if (idx !== -1) {
        globalTenantsStore[idx] = body.tenant;
      } else {
        globalTenantsStore.push(body.tenant);
      }
      return NextResponse.json({ success: true, tenants: globalTenantsStore });
    }
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
