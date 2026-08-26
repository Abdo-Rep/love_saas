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

const heartSvgIcon = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>❤️</text></svg>';

export const metadata: Metadata = {
  title: 'سولاف',
  description: 'منصة الحب والذكريات الرومانسية',
  manifest: '/manifest.json',
  icons: {
    icon: heartSvgIcon,
    shortcut: heartSvgIcon,
    apple: heartSvgIcon,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'سولاف',
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
        <link rel="icon" href={heartSvgIcon} />
        <link rel="shortcut icon" href={heartSvgIcon} />
        <link rel="apple-touch-icon" href={heartSvgIcon} />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-[#090108] text-white antialiased selection:bg-[#f472b6] selection:text-white min-h-[100dvh] max-w-full overflow-x-hidden">
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
