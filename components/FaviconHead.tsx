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

    // Add light mode favicon
    const lightLink = document.createElement('link');
    lightLink.rel = 'icon';
    lightLink.type = 'image/svg+xml';
    lightLink.href = '/favicon-desktop.svg';
    lightLink.setAttribute('media', '(prefers-color-scheme: light)');
    document.head.appendChild(lightLink);

    // Add dark mode favicon
    const darkLink = document.createElement('link');
    darkLink.rel = 'icon';
    darkLink.type = 'image/x-icon';
    darkLink.href = '/favicon.ico';
    darkLink.setAttribute('media', '(prefers-color-scheme: dark)');
    document.head.appendChild(darkLink);

    return () => {
      lightLink.remove();
      darkLink.remove();
    };
  }, []);

  return null;
}

