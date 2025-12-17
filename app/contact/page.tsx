'use client';

import { useEffect } from 'react';
import SchedulingEmbed from '@/components/SchedulingEmbed';

export default function Contact() {
  // Handle hash scroll to #schedule anchor
  useEffect(() => {
    if (window.location.hash === '#schedule') {
      // Use a small timeout to ensure the page has fully loaded
      setTimeout(() => {
        const scheduleElement = document.getElementById('schedule');
        if (scheduleElement) {
          scheduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="pt-20 min-h-screen overflow-x-hidden">
      <section id="schedule" className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 lg:py-24 scroll-mt-28">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-4 sm:px-0">
            Schedule a walkthrough
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-6 md:px-0">
            Pick a time that fits. You will receive a calendar invite instantly.
          </p>
        </div>

        <SchedulingEmbed />

        <div className="mt-8 sm:mt-10 md:mt-12 text-center px-4 sm:px-0">
          <p className="text-white/60 text-xs sm:text-sm mb-2">
            Prefer email? Contact us directly at
          </p>
          <a 
            href="mailto:info@corqon.com" 
            className="text-white hover:opacity-80 transition-opacity font-medium text-sm sm:text-base break-all sm:break-normal"
          >
            info@corqon.com
          </a>
        </div>
      </section>
    </div>
  );
}

