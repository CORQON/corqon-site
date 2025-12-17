'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change or outside click
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      
      // Close menu on escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeMobileMenu();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEscape);
      };
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex justify-center">
            <div
              className={`grid grid-cols-3 items-center h-14 px-4 sm:px-6 md:px-8 ${
                isScrolled
                  ? 'rounded-full backdrop-blur-sm md:backdrop-blur-xl border shadow-lg'
                  : ''
              }`}
              style={
                isScrolled
                  ? {
                      background: 'linear-gradient(to bottom, rgba(40,40,40,0.70), rgba(15,15,15,0.55)), linear-gradient(to right, rgba(255,255,255,0.06), transparent 40%, rgba(255,255,255,0.04))',
                      borderColor: 'rgba(107, 114, 128, 0.2)',
                    }
                  : undefined
              }
            >
              {/* Left: Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center gap-2 text-base sm:text-lg font-semibold text-white hover:opacity-80" onClick={closeMobileMenu}>
                  <Image
                    src="/corqon-symbol.png"
                    alt="CORQON"
                    width={36}
                    height={36}
                    className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
                    priority
                  />
                  <span className="hidden sm:inline">CORQON</span>
                </Link>
              </div>
              
              {/* Center: Navigation Links - Desktop only */}
              <div className="hidden md:flex items-center justify-center space-x-8">
                <a href="#datastreams" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                  Datastreams
                </a>
                <a href="#briefing-chat" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                  Advisor
                </a>
                <a href="#weekly-data" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                  Briefing
                </a>
                <a href="#faq-assistant" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                  FAQ
                </a>
                <a href="#pricing" className="text-white/70 hover:text-white transition-colors text-sm font-medium">
                  Pricing
                </a>
              </div>

              {/* Right: CTA + Mobile Menu Button */}
              <div className="flex items-center justify-end gap-2">
                {/* Mobile Menu Button - Only visible on mobile */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 rounded"
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {isMobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
                {/* CTA Button */}
                <Link 
                  href="/contact#schedule" 
                  className="px-4 sm:px-5 py-2 bg-gray-900 btn-gradient text-white rounded-full font-medium hover:bg-gray-800 transition-all text-xs sm:text-sm whitespace-nowrap min-h-[44px] flex items-center justify-center"
                  onClick={closeMobileMenu}
                >
                  Plan a pilot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/80 backdrop-blur-sm"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed top-0 left-0 right-0 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          top: '88px', // Height of navbar + padding
        }}
      >
        <div className="bg-neutral-900/95 backdrop-blur-sm md:backdrop-blur-xl border-b border-white/10 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              <a
                href="#datastreams"
                className="text-white/70 hover:text-white transition-colors text-base font-medium py-2 min-h-[44px] flex items-center"
                onClick={closeMobileMenu}
              >
                Datastreams
              </a>
              <a
                href="#briefing-chat"
                className="text-white/70 hover:text-white transition-colors text-base font-medium py-2 min-h-[44px] flex items-center"
                onClick={closeMobileMenu}
              >
                Advisor
              </a>
              <a
                href="#weekly-data"
                className="text-white/70 hover:text-white transition-colors text-base font-medium py-2 min-h-[44px] flex items-center"
                onClick={closeMobileMenu}
              >
                Briefing
              </a>
              <a
                href="#faq-assistant"
                className="text-white/70 hover:text-white transition-colors text-base font-medium py-2 min-h-[44px] flex items-center"
                onClick={closeMobileMenu}
              >
                FAQ
              </a>
              <a
                href="#pricing"
                className="text-white/70 hover:text-white transition-colors text-base font-medium py-2 min-h-[44px] flex items-center"
                onClick={closeMobileMenu}
              >
                Pricing
              </a>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
