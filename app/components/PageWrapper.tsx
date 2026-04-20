'use client';

import { usePathname } from 'next/navigation';

// Pages with a full-bleed hero image that intentionally sits under the transparent navbar
const HERO_PAGES = ['/'];

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHeroPage = HERO_PAGES.includes(pathname);

  return (
    <main className={isHeroPage ? '' : 'pt-20'}>
      {children}
    </main>
  );
}
