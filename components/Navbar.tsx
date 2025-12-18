'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Detect mobile on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // Mobile-only scroll handler: hide on scroll down, show on scroll up
  useEffect(() => {
    if (!isMobile) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDifference = currentScrollY - lastScrollYRef.current;
          
          // Show navbar when scrolling up or at the top
          if (scrollDifference < 0 || currentScrollY < 10) {
            setIsMobileNavVisible(true);
          } 
          // Hide navbar when scrolling down (and not at top)
          else if (scrollDifference > 0 && currentScrollY > 10) {
            setIsMobileNavVisible(false);
          }
          
          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // Desktop-only scroll handler - completely disabled on mobile
  useEffect(() => {
    // CRITICAL: Never run scroll handler on mobile
    if (isMobile) {
      return () => {}; // Return empty cleanup to satisfy React
    }
    
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
  }, [isMobile]);

  // Mobile menu handler - simplified
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen, isMobile]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close menu on Escape key
  useEffect(() => {
    if (!isMobile) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, isMobile]);

  // Mobile: Pill-shaped navbar matching desktop style
  if (isMobile) {
    return (
      <>
        <nav className={`fixed top-0 left-0 right-0 z-50 pt-4 pb-4 transition-transform duration-300 ${
          isMobileNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center">
              <div
                className={`flex items-center justify-between h-14 px-4 w-full ${
                  isScrolled
                    ? 'rounded-full backdrop-blur-xl border shadow-lg'
                    : 'rounded-full backdrop-blur-xl border shadow-lg'
                }`}
                style={{
                  background: 'linear-gradient(to bottom, rgba(40,40,40,0.70), rgba(15,15,15,0.55)), linear-gradient(to right, rgba(255,255,255,0.06), transparent 40%, rgba(255,255,255,0.04))',
                  borderColor: 'rgba(107, 114, 128, 0.2)',
                }}
              >
                {/* Left: Logo */}
                <div className="flex items-center">
                  <Link href="/" className="flex items-center hover:opacity-80">
                    <img
                      src="/logo-witte.svg"
                      alt="CORQON"
                      className="h-6 w-auto"
                    />
                  </Link>
                </div>

                {/* Right: Hamburger + Pilot Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
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
                  <Link 
                    href="/contact#schedule" 
                    className="px-4 py-2 bg-gray-900 btn-gradient text-white rounded-full font-medium hover:bg-gray-800 transition-all text-xs whitespace-nowrap min-h-[44px] flex items-center justify-center"
                    onClick={closeMobileMenu}
                  >
                    Plan a pilot
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            <div className="fixed top-[88px] left-0 right-0 z-50">
              <div className="max-w-7xl mx-auto px-4">
                <div
                  className="rounded-2xl backdrop-blur-xl border shadow-lg"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(40,40,40,0.95), rgba(15,15,15,0.90)), linear-gradient(to right, rgba(255,255,255,0.08), transparent 40%, rgba(255,255,255,0.06))',
                    borderColor: 'rgba(107, 114, 128, 0.3)',
                  }}
                >
                  <nav className="flex flex-col px-4 py-4 space-y-2" role="menu">
                    <a
                      href="#datastreams"
                      className="text-white/70 hover:text-white text-sm font-medium py-2 transition-colors"
                      onClick={closeMobileMenu}
                      role="menuitem"
                    >
                      Datastreams
                    </a>
                    <a
                      href="#briefing-chat"
                      className="text-white/70 hover:text-white text-sm font-medium py-2 transition-colors"
                      onClick={closeMobileMenu}
                      role="menuitem"
                    >
                      Advisor
                    </a>
                    <a
                      href="#weekly-data"
                      className="text-white/70 hover:text-white text-sm font-medium py-2 transition-colors"
                      onClick={closeMobileMenu}
                      role="menuitem"
                    >
                      Briefing
                    </a>
                    <a
                      href="#faq-assistant"
                      className="text-white/70 hover:text-white text-sm font-medium py-2 transition-colors"
                      onClick={closeMobileMenu}
                      role="menuitem"
                    >
                      FAQ
                    </a>
                    <a
                      href="#pricing"
                      className="text-white/70 hover:text-white text-sm font-medium py-2 transition-colors"
                      onClick={closeMobileMenu}
                      role="menuitem"
                    >
                      Pricing
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop: Full featured navbar with animations
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 pt-4 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex justify-center">
            <div
              className={`grid grid-cols-3 items-center h-14 px-4 sm:px-6 md:px-8 ${
                isScrolled
                  ? 'rounded-full backdrop-blur-xl border shadow-lg'
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
                <Link href="/" className="flex items-center hover:opacity-80">
                  <img
                    src="/logo-witte.svg"
                    alt="CORQON"
                    className="h-7 w-auto sm:h-8 shrink-0"
                  />
                </Link>
              </div>
              
              {/* Center: Navigation Links */}
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

              {/* Right: CTA Button */}
              <div className="flex items-center justify-end">
                <Link 
                  href="/contact#schedule" 
                  className="px-4 sm:px-5 py-2 bg-gray-900 btn-gradient text-white rounded-full font-medium hover:bg-gray-800 transition-all text-xs sm:text-sm whitespace-nowrap min-h-[44px] flex items-center justify-center"
                >
                  Plan a pilot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
