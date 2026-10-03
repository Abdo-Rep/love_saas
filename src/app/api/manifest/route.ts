import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path') || '/';
    const customName = searchParams.get('name') || '';

    let name = 'سولاف - منصة الحب والذكريات الرومانسية 💖';
    let shortName = 'سولاف 💖';
    let startUrl = '/';
    let scope = '/';

    const cleanPath = path.toLowerCase().trim();

    if (cleanPath.startsWith('/super-admin')) {
      name = 'لوحة تحكم المنصة الملكية 👑';
      shortName = 'السوبر أدمن 👑';
      startUrl = '/super-admin';
      scope = '/super-admin';
    } else if (cleanPath.includes('/admin')) {
      // Tenant Admin Page (e.g. /mohamed-somaya/admin or /admin)
      const slugMatch = cleanPath.match(/^\/([^\/]+)\/admin/);
      const slug = slugMatch ? slugMatch[1] : '';
      name = customName ? `لوحة تحكم ${customName} 🔑` : (slug ? `لوحة تحكم ${slug} 🔑` : 'لوحة تحكم الموقع 🔑');
      shortName = slug ? `أدمن ${slug}` : 'الأدمن 🔑';
      startUrl = path;
      scope = path;
    } else if (cleanPath !== '/' && cleanPath !== '') {
      // Client Visitor Page (e.g. /mohamed-somaya)
      const slug = cleanPath.replace(/^\//, '').split('/')[0];
      let formattedTitle = slug;
      if (formattedTitle.includes('-')) {
        formattedTitle = formattedTitle.split('-').map(s => s.trim()).filter(Boolean).join(' & ');
      }
      name = customName ? `هدية الحب: ${customName} 💖` : `هدية حب: ${formattedTitle} 💖`;
      shortName = customName || formattedTitle || 'هدية حب 💖';
      startUrl = path;
      scope = path;
    }

    const manifest = {
      name,
      short_name: shortName,
      description: 'عالمٌ خُصص لأجلكِ وحدكِ.. حيث تبتسم الذكريات وتُحكى أجمل حكايات العشق ✨',
      start_url: startUrl,
      scope,
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#090108',
      theme_color: '#090108',
      icons: [
        {
          src: '/images/peasant_girl.jpg',
          sizes: '192x192',
          type: 'image/jpeg',
          purpose: 'any maskable'
        },
        {
          src: '/images/peasant_girl.jpg',
          sizes: '512x512',
          type: 'image/jpeg',
          purpose: 'any maskable'
        }
      ]
    };

    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
