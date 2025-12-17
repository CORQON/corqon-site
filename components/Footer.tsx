import Link from 'next/link';

const SOCIAL = {
  x: 'https://x.com/corqon_ai',
  linkedin: 'https://www.linkedin.com/in/corqon-ai-257b6639a/',
  instagram: 'https://www.instagram.com/corqon.ai/',
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="corqon-footer-premium relative overflow-hidden border-t border-white/10 bg-black/40 backdrop-blur-sm z-10">
      <div className="corqon-footer-mark" aria-hidden="true">
        <svg viewBox="0 0 1000 1000" className="corqon-footer-mark-svg" role="presentation">
          <defs>
            {/* Extract edge from PNG alpha */}
            <filter id="corqonEdge" x="-20%" y="-20%" width="140%" height="140%">
              <feMorphology in="SourceAlpha" operator="dilate" radius="2.5" result="dilated" />
              <feComposite in="dilated" in2="SourceAlpha" operator="out" result="edge" />
              <feGaussianBlur in="edge" stdDeviation="0.6" result="edgeBlur" />
            </filter>

            {/* Soft glow for the sweep, still subtle */}
            <filter id="corqonSweepGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
            </filter>

            {/* Mask that only shows the edge ring */}
            <mask id="corqonEdgeMask">
              <rect width="100%" height="100%" fill="black" />
              <image
                href="/corqon-symbol.png"
                x="0"
                y="0"
                width="1000"
                height="1000"
                preserveAspectRatio="xMidYMid meet"
                filter="url(#corqonEdge)"
              />
            </mask>

            {/* Narrow light band */}
            <linearGradient id="corqonSweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59,130,246,0)" />
              <stop offset="42%" stopColor="rgba(59,130,246,0)" />
              <stop offset="50%" stopColor="rgba(59,130,246,0.95)" />
              <stop offset="58%" stopColor="rgba(59,130,246,0)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </linearGradient>
          </defs>

          {/* Base watermark */}
          <image
            href="/corqon-symbol.png"
            x="0"
            y="0"
            width="1000"
            height="1000"
            preserveAspectRatio="xMidYMid meet"
            opacity="0.055"
          />

          {/* Edge sweep constrained to the edge mask */}
          <g mask="url(#corqonEdgeMask)" opacity="0.55" filter="url(#corqonSweepGlow)">
            <g className="corqon-footer-sweep-rot">
              <rect x="-600" y="0" width="2200" height="1000" fill="url(#corqonSweepGrad)" />
            </g>
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">CORQON</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Corqon connects your operational data streams and detects systemic performance loss early. AI surfaces patterns behind instability, rework, and hidden margin erosion.
            </p>
            <a 
              href="mailto:info@corqon.com" 
              className="text-sm text-white/60 hover:text-white/90 transition-colors"
            >
              info@corqon.com
            </a>
          </div>
          
          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/#datastreams" 
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Datastreams
                </Link>
              </li>
              <li>
                <Link 
                  href="/#briefing-chat" 
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Advisor
                </Link>
              </li>
              <li>
                <Link 
                  href="/#weekly-data" 
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Briefing
                </Link>
              </li>
              <li>
                <Link 
                  href="/#faq-assistant" 
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/#pricing" 
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/contact" 
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact#schedule" 
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Plan a pilot
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal & Social */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4">Legal</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <Link 
                  href="/terms" 
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="text-sm text-white/60 hover:text-white/90 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>

            <h4 className="text-sm font-semibold text-white/80 mb-4">Social</h4>
            <div className="flex gap-4">
              <a 
                href={SOCIAL.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white/90 transition-colors"
                aria-label="CORQON on X"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a 
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white/90 transition-colors"
                aria-label="CORQON on LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white/90 transition-colors"
                aria-label="CORQON on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-white/10">
          <p className="text-white/40 text-xs sm:text-sm text-center">
            © {currentYear} CORQON. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
