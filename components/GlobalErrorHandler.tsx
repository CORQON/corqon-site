'use client';

import { useEffect, useState } from 'react';

export default function GlobalErrorHandler() {
  const [lastError, setLastError] = useState<{ message: string; stack?: string } | null>(null);
  const debugEnabled = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_DEBUG_ERRORS === '1';

  useEffect(() => {
    // Global error handler to prevent crashes on mobile
    const handleError = (e: ErrorEvent) => {
      e.preventDefault();
      
      const errorInfo = {
        message: e.message || String(e.error?.message || 'Unknown error'),
        stack: e.error?.stack || e.filename ? `${e.filename}:${e.lineno}:${e.colno}` : undefined,
      };
      
      if (debugEnabled) {
        setLastError(errorInfo);
      }
      
      if (process.env.NODE_ENV === 'development' || debugEnabled) {
        console.error('Global error:', e.error, errorInfo);
      }
      
      return false;
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      e.preventDefault();
      
      const errorInfo = {
        message: String(e.reason?.message || e.reason || 'Unhandled promise rejection'),
        stack: e.reason?.stack,
      };
      
      if (debugEnabled) {
        setLastError(errorInfo);
      }
      
      if (process.env.NODE_ENV === 'development' || debugEnabled) {
        console.error('Unhandled promise rejection:', e.reason, errorInfo);
      }
      
      return false;
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [debugEnabled]);

  return debugEnabled && lastError ? (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        maxWidth: '320px',
        padding: '12px',
        backgroundColor: 'rgba(220, 38, 38, 0.95)',
        color: 'white',
        fontSize: '12px',
        borderRadius: '8px',
        zIndex: 99999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        fontFamily: 'monospace',
        wordBreak: 'break-word',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Last Error:</div>
      <div style={{ marginBottom: '4px' }}>{lastError.message}</div>
      {lastError.stack && (
        <details style={{ marginTop: '8px' }}>
          <summary style={{ cursor: 'pointer', fontSize: '11px', opacity: 0.9 }}>Stack trace</summary>
          <pre style={{ marginTop: '4px', fontSize: '10px', overflow: 'auto', maxHeight: '200px' }}>
            {lastError.stack}
          </pre>
        </details>
      )}
      <button
        onClick={() => setLastError(null)}
        style={{
          marginTop: '8px',
          padding: '4px 8px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '11px',
        }}
      >
        Dismiss
      </button>
    </div>
  ) : null;
}

