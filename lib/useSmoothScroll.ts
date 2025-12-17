'use client';

import { usePathname } from 'next/navigation';

export function useSmoothScroll() {
  const pathname = usePathname();

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, targetPath: string, hash: string) => {
    // If we're already on the target page, handle scroll locally
    if (pathname === targetPath) {
      e.preventDefault();
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        const OFFSET = 100;
        const y = element.getBoundingClientRect().top + window.scrollY - OFFSET;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    // Otherwise, let Next.js Link handle the navigation (hash will be processed by page's useEffect)
  };

  return { handleHashClick };
}

