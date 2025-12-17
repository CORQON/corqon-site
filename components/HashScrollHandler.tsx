'use client';

import { useEffect } from 'react';

export default function HashScrollHandler() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash !== '#briefing-chat') return;
    
    // Disable smooth scroll on mobile to prevent performance issues
    const isMobile = window.innerWidth < 768;

    const el = document.getElementById('briefing-chat');
    if (!el) return;

    const ANCHOR_OFFSET_PX = 120;

    const run = () => {
      const y = el.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET_PX;
      // Use instant scroll on mobile, smooth on desktop
      window.scrollTo({ top: y, behavior: isMobile ? 'auto' : 'smooth' });
    };

    // Wait for next frame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(run, 100);
    });
  }, []);

  return null;
}

