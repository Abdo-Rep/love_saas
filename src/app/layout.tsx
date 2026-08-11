import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ConfigProvider } from '@/lib/configContext';

export const viewport: Viewport = {
  themeColor: '#090108',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'منصة الحب والذكريات الرومانسية 👑',
  description: 'تجربة عالم فضائي شخصي مليء بالذكريات والحب',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'منصة الحب',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-[#090108] text-white antialiased selection:bg-[#f472b6] selection:text-white min-h-[100dvh] max-w-full overflow-x-hidden">
        <ConfigProvider>
          {children}
        </ConfigProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
