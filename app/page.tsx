'use client';

import Link from 'next/link';
import GridHeroBackground from '@/components/GridHeroBackground';
import GridFrameSection from '@/components/GridFrameSection';
import SystemIntelligenceSection from '@/components/SystemIntelligenceSection';
import WeeklyCfoReportSection from '@/components/WeeklyCfoReportSection';
import CfoDashboardDemo from '@/components/CfoDashboardDemo';
import HashScrollHandler from '@/components/HashScrollHandler';
import PrivacyComplianceSection from '@/components/PrivacyComplianceSection';
import dynamic from 'next/dynamic';

const FaqAssistantBlock = dynamic(() => import('@/components/FaqAssistantBlock'), {
  ssr: false,
  loading: () => null,
});

const AnimatedChatDemo = dynamic(() => import('@/components/AnimatedChatDemo'), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  return (
    <div className="overflow-x-hidden min-w-0">
      <HashScrollHandler />
      {/* Hero Section */}
      <section data-hero id="hero" className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-20 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16 lg:pt-36 lg:pb-20 overflow-hidden corqon-section-loose">
        <GridHeroBackground />
        <div className="absolute inset-0 z-[1] pointer-events-none hero-gradient-fade"></div>
        <div className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 sm:mb-8 text-xs sm:text-sm text-white/70 mt-8 sm:mt-0">
              <span className="break-words">Explore how Corqon can make your company win</span>
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h1 className="hero-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
              Engineered To Win
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto px-4 sm:px-6 md:px-0">
              Most margin loss doesn't come from costs, but from what you can't see.
              CORQON exposes hidden performance loss and early absenteeism risk before it compounds.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 px-4 sm:px-0">
              <Link 
                href="/contact#schedule"
                className="px-5 py-3 sm:py-2 bg-gray-900 btn-gradient text-white rounded-full font-medium hover:bg-gray-800 transition-all text-sm min-h-[44px] flex items-center justify-center"
              >
                Plan a pilot
              </Link>
              <a
                href="#weekly-data"
                className="group inline-flex items-center justify-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-0 min-h-[44px]"
              >
                View sample briefing
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-20 xl:mt-24 flex justify-center px-2 sm:px-0">
            <div className="w-full max-w-7xl lg:max-w-[90rem] xl:max-w-[100rem] 2xl:max-w-[110rem] mx-auto">
              <CfoDashboardDemo />
            </div>
          </div>
        </div>
      </section>

      {/* System Intelligence Section */}
      <SystemIntelligenceSection />

      {/* Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 corqon-section">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 px-4 sm:px-0">
            Client Organizations
          </h2>
          <p className="text-xs sm:text-sm uppercase tracking-wider text-white/40 mb-8 sm:mb-12 font-medium px-4 sm:px-0">
            Used by teams that operate at scale
          </p>
          <div className="logos-container">
            <div className="logos-scroll opacity-40">
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              {/* Duplicate for seamless loop */}
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
              <div className="h-8 w-32 bg-white/20 rounded flex-shrink-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Chat Demo */}
      <AnimatedChatDemo />

      {/* Weekly CFO Report Section */}
      <WeeklyCfoReportSection />

      {/* Privacy and Compliance Section */}
      <PrivacyComplianceSection />

      <GridFrameSection>
        <FaqAssistantBlock />
      </GridFrameSection>

      {/* Final CTA */}
      <section id="pricing" className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 corqon-section-loose scroll-mt-28 overflow-hidden">
        {/* CRITICAL: GridHeroBackground already checks isDesktop internally and returns null on mobile */}
        <div className="absolute top-0 left-0 right-0 bottom-0 md:bottom-[-400px] pointer-events-none overflow-hidden">
          <div className="cta-grid-fade absolute inset-0 hidden md:block">
            <GridHeroBackground />
          </div>
        </div>
        <div className="relative z-10">
          <div className="corqon-cta-pop p-8 sm:p-10 md:p-12 lg:p-16 text-center">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-2 sm:px-0">
                Make performance sustainable.
              </h2>
              <p className="text-white/60 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto px-4 sm:px-6 md:px-0">
                Corqon turns system-level signals into clear leadership actions, privacy-safe and measurable.
              </p>
              <Link 
                href="/contact#schedule"
                className="inline-flex w-fit items-center justify-center px-5 py-3 sm:py-2 bg-gray-900 btn-gradient text-white rounded-full font-medium hover:bg-gray-800 transition-all text-sm min-h-[44px] mx-auto"
              >
                Schedule a walkthrough
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

