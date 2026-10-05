import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function DynamicManifest() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const origin = window.location.origin;
    const currentPath = (pathname || window.location.pathname || '/').trim();
    const cleanPath = currentPath.toLowerCase();

    let name = 'سولاف - منصة الحب والذكريات الرومانسية 💖';
    let shortName = 'سولاف 💖';
    let startUrl = `${origin}${currentPath}`;

    if (cleanPath.startsWith('/super-admin')) {
      name = 'لوحة تحكم المنصة الملكية 👑';
      shortName = 'سوبر أدمن 👑';
      startUrl = `${origin}/super-admin`;
    } else if (cleanPath.includes('/admin')) {
      const slugMatch = cleanPath.match(/^\/([^\/]+)\/admin/);
      const slug = slugMatch ? slugMatch[1] : '';
      name = slug ? `لوحة تحكم ${slug} 🔑` : 'لوحة تحكم الموقع 🔑';
      shortName = slug ? `أدمن ${slug}` : 'الأدمن 🔑';
      startUrl = slug ? `${origin}/${slug}/admin` : `${origin}/admin`;
    } else if (cleanPath !== '/' && cleanPath !== '') {
      const rawSlug = cleanPath.replace(/^\//, '').split('/')[0];
      let formattedTitle = decodeURIComponent(rawSlug);
      if (formattedTitle.includes('-')) {
        formattedTitle = formattedTitle.split('-').map((s) => s.trim()).filter(Boolean).join(' & ');
      } else if (formattedTitle.includes('_')) {
        formattedTitle = formattedTitle.split('_').map((s) => s.trim()).filter(Boolean).join(' & ');
      }
      name = `هدية حب: ${formattedTitle} 💖`;
      shortName = formattedTitle || 'هدية حب 💖';
      startUrl = `${origin}/${rawSlug}`;
    }

    const manifestObj = {
      name,
      short_name: shortName,
      description: 'عالمٌ خُصص لأجلكِ وحدكِ.. حيث تبتسم الذكريات وتُحكى أجمل حكايات العشق ✨',
      start_url: startUrl,
      scope: `${origin}/`,
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#090108',
      theme_color: '#090108',
      icons: [
        {
          src: `${origin}/icon.svg`,
          sizes: '192x192 512x512',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        },
        {
          src: `${origin}/images/peasant_girl.jpg`,
          sizes: '192x192 512x512',
          type: 'image/jpeg',
          purpose: 'any',
        },
      ],
    };

    const manifestDataUri = `data:application/manifest+json;charset=utf-8,${encodeURIComponent(JSON.stringify(manifestObj))}`;

    let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = manifestDataUri;

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, [pathname]);

  return null;
}
