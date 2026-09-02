import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export function formatSlugToTitle(slug: string): string {
  if (!slug) return 'Soulove';
  const cleanSlug = decodeURIComponent(slug).trim();
  if (cleanSlug.includes('-')) {
    return cleanSlug.split('-').map((s) => s.trim()).filter(Boolean).join(' & ');
  }
  if (cleanSlug.includes('_')) {
    return cleanSlug.split('_').map((s) => s.trim()).filter(Boolean).join(' & ');
  }
  return cleanSlug;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const formattedTitle = formatSlugToTitle(params.slug);
  return {
    title: formattedTitle,
    description: `موقع خاص ${formattedTitle}`,
    openGraph: {
      title: formattedTitle,
      description: `موقع خاص ${formattedTitle}`,
    },
  };
}

export default function SlugLayout({ children }: Props) {
  return <>{children}</>;
}
