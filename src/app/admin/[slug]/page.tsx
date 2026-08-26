'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RedirectPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = params?.slug || 'rawda';

  useEffect(() => {
    router.replace(`/${slug}/admin`);
  }, [slug, router]);

  return (
    <div className="min-h-screen w-full bg-[#090108] text-white flex items-center justify-center p-4">
      <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
