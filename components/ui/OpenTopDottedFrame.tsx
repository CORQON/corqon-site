import { ReactNode } from 'react';

interface OpenTopDottedFrameProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  alignClassName?: string;
  fadeFromTopPx?: number;
}

export default function OpenTopDottedFrame({ 
  children, 
  className = '',
  contentClassName = '',
  alignClassName = '',
  fadeFromTopPx = 56
}: OpenTopDottedFrameProps) {
  // Build the fade mask CSS
  const fadeMaskStyle = {
    maskImage: `linear-gradient(to bottom, transparent 0px, black ${fadeFromTopPx}px, black 100%)`,
    WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, black ${fadeFromTopPx}px, black 100%)`,
  };

  return (
    <div className={`relative ${alignClassName || className}`}>
      {/* Dotted Frame - Left, Right, Bottom only */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left vertical line with fade-in */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-px open-top-dotted-frame-v"
          style={fadeMaskStyle}
        />
        {/* Right vertical line with fade-in */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-px open-top-dotted-frame-v"
          style={fadeMaskStyle}
        />
        {/* Bottom horizontal line (no fade) */}
        <div 
          className="absolute left-0 right-0 bottom-0 h-px open-top-dotted-frame-h"
        />
      </div>

      {/* Content with optional padding */}
      <div className={`relative ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
