'use client';

import { ReactNode } from 'react';

interface GridFrameSectionProps {
  children: ReactNode;
}

export default function GridFrameSection({ children }: GridFrameSectionProps) {
  return (
    <section id="faq-assistant" className="relative corqon-section scroll-mt-28">
      {/* Full-width Dotted Grid Overlay with Fade from sides */}
      <div 
        className="absolute inset-0 dotted-grid-overlay pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}
