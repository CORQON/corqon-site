'use client';

import { useEffect } from 'react';

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Global error handler to prevent crashes on mobile
    const handleError = (e: ErrorEvent) => {
      e.preventDefault();
      if (process.env.NODE_ENV === 'development') {
        console.error('Global error:', e.error);
      }
      return false;
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      e.preventDefault();
      if (process.env.NODE_ENV === 'development') {
        console.error('Unhandled promise rejection:', e.reason);
      }
      return false;
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}

