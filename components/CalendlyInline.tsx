'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

interface CalendlyInlineProps {
  url?: string;
  title?: string;
  className?: string;
}

export default function CalendlyInline({ 
  url, 
  title = 'Schedule a meeting',
  className = '' 
}: CalendlyInlineProps) {
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isDev, setIsDev] = useState(false);
  const [baseUrl, setBaseUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're in development
    setIsDev(process.env.NODE_ENV === 'development');

    // Use provided URL prop or fall back to environment variable
    const envUrl = url || process.env.NEXT_PUBLIC_CALENDLY_URL;
    setBaseUrl(envUrl || null);
    
    if (!envUrl) {
      setShowWarning(true);
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '⚠️ NEXT_PUBLIC_CALENDLY_URL is not set in environment variables.\n' +
          'Set it in Vercel Project Settings → Environment Variables for Preview and Production.'
        );
      }
      return;
    }

    try {
      // Parse the base URL
      const parsedUrl = new URL(envUrl);
      
      // Enforce HTTPS to avoid mixed content issues
      if (parsedUrl.protocol === 'http:') {
        parsedUrl.protocol = 'https:';
        console.warn('Calendly URL was HTTP, upgraded to HTTPS for security');
      }
      
      // Remove any month-locking query param
      parsedUrl.searchParams.delete('month');
      
      // Enforce dark theme parameters (hex values without #)
      // Using CORQON blue (#3b82f6) as primary color
      parsedUrl.searchParams.set('background_color', '0b0f17');
      parsedUrl.searchParams.set('text_color', 'e5e7eb');
      parsedUrl.searchParams.set('primary_color', '3b82f6');
      parsedUrl.searchParams.set('hide_event_type_details', '1');
      
      setCalendlyUrl(parsedUrl.toString());
    } catch (error) {
      console.error('Error parsing Calendly URL:', error);
      setShowWarning(true);
    }
  }, [url]);

  // Warning state: show dev message or user-friendly fallback
  if (showWarning) {
    return (
      <div className={`p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 ${className}`}>
        {isDev ? (
          <div className="text-center space-y-4">
            <p className="text-yellow-400 text-sm font-medium">
              ⚠️ Development Warning: NEXT_PUBLIC_CALENDLY_URL is not set
            </p>
            <p className="text-white/60 text-sm">
              Set this environment variable in Vercel Project Settings → Environment Variables
            </p>
            <p className="text-white/40 text-xs mt-2">
              Example: <code className="bg-white/10 px-2 py-1 rounded">https://calendly.com/corqon/30min?back=1</code>
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-white/60 text-sm">
              Scheduling is temporarily unavailable. Please contact us directly at{' '}
              <a 
                href="mailto:info@corqon.com" 
                className="text-white hover:opacity-80 transition-opacity underline"
              >
                info@corqon.com
              </a>
              {' '}or{' '}
              {baseUrl && (
                <a
                  href={baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:opacity-80 transition-opacity underline"
                >
                  open Calendly in a new tab
                </a>
              )}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (!calendlyUrl) {
    return null;
  }

  // Get the base URL for the fallback link (without theme params)
  const baseUrlForLink = url || process.env.NEXT_PUBLIC_CALENDLY_URL || '';

  return (
    <>
      <Script
        id="calendly-widget-script"
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onError={(e) => {
          console.error('Failed to load Calendly widget script:', e);
        }}
      />
      <div className={`bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 overflow-hidden ${className}`}>
        <div
          className="calendly-inline-widget"
          data-url={calendlyUrl}
          style={{
            minWidth: '320px',
            height: '700px',
          }}
        >
          <style jsx>{`
            .calendly-inline-widget {
              width: 100%;
            }
            @media (max-width: 640px) {
              .calendly-inline-widget {
                height: 800px !important;
              }
            }
          `}</style>
        </div>
        {/* Fallback link for accessibility and as backup */}
        <div className="mt-4 text-center">
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white/80 text-sm transition-colors underline"
          >
            {title} (open in new tab)
          </a>
        </div>
      </div>
    </>
  );
}

