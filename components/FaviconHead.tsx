'use client';

import { useEffect } from 'react';

export default function FaviconHead() {
  useEffect(() => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll('link[rel="icon"]');
    existingLinks.forEach(link => {
      if (link.getAttribute('media') === '(prefers-color-scheme: light)' || 
          link.getAttribute('media') === '(prefers-color-scheme: dark)') {
        link.remove();
      }
    });

    // Add desktop favicon (kavehcakla.svg) - primary favicon for desktop browsers
    const desktopLink = document.createElement('link');
    desktopLink.rel = 'icon';
    desktopLink.type = 'image/svg+xml';
    desktopLink.href = '/kavehcakla.svg';
    document.head.appendChild(desktopLink);

    // Add dark mode favicon as fallback
    const darkLink = document.createElement('link');
    darkLink.rel = 'icon';
    darkLink.type = 'image/x-icon';
    darkLink.href = '/favicon.ico';
    darkLink.setAttribute('media', '(prefers-color-scheme: dark)');
    document.head.appendChild(darkLink);

    return () => {
      desktopLink.remove();
      darkLink.remove();
    };
  }, []);

  return null;
}

