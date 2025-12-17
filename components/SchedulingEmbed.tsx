'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function SchedulingEmbed() {
  const [schedulingUrl, setSchedulingUrl] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_SCHEDULING_URL;
    if (!baseUrl) {
      setShowWarning(true);
      console.warn('NEXT_PUBLIC_SCHEDULING_URL is not set in environment variables');
      return;
    }

    try {
      // Parse the base URL
      const url = new URL(baseUrl);
      
      // Remove any month-locking query param
      url.searchParams.delete('month');
      
      // Enforce dark theme parameters (hex values without #)
      // Using CORQON blue (#3b82f6) as primary color
      url.searchParams.set('background_color', '0b0f17');
      url.searchParams.set('text_color', 'e5e7eb');
      url.searchParams.set('primary_color', '3b82f6');
      url.searchParams.set('hide_event_type_details', '1');
      
      setSchedulingUrl(url.toString());
    } catch (error) {
      console.error('Error parsing scheduling URL:', error);
      setShowWarning(true);
    }
  }, []);

  if (showWarning) {
    return (
      <div className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
        <p className="text-white/60 text-sm text-center">
          Scheduling is temporarily unavailable. Please contact us directly at{' '}
          <a href="mailto:info@corqon.com" className="text-white hover:opacity-80 transition-opacity underline">
            info@corqon.com
          </a>
        </p>
      </div>
    );
  }

  if (!schedulingUrl) {
    return null;
  }

  return (
    <>
      <Script
        id="calendly-widget-script"
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
      />
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6 overflow-hidden">
        <div
          className="calendly-inline-widget"
          data-url={schedulingUrl}
          style={{
            minWidth: '320px',
            height: '720px',
          }}
        >
          <style jsx>{`
            @media (max-width: 640px) {
              .calendly-inline-widget {
                height: 820px !important;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}

