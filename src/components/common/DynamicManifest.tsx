'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function DynamicManifest() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Dynamically set/update the manifest <link> based on active URL pathname
    const currentPath = pathname || window.location.pathname || '/';
    const manifestUrl = `/api/manifest?path=${encodeURIComponent(currentPath)}&t=${Date.now()}`;

    let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = manifestUrl;

    // 2. Register Service Worker if supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, [pathname]);

  return null;
}
