import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-white/60 hover:text-white/90 transition-colors mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>

        <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4">Cookie Policy</h1>
        <p className="text-white/50 text-sm mb-12">Last updated: December 17, 2025</p>

        <div className="space-y-10 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. They 
              help websites remember your preferences and improve your browsing experience. This Cookie 
              Policy explains how CORQON uses cookies and similar technologies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
            <p className="mb-4">
              CORQON uses cookies to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Keep you signed in to your account</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our platform</li>
              <li>Improve our services and user experience</li>
              <li>Ensure the security of our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Essential Cookies</h3>
                <p>
                  These cookies are necessary for the platform to function properly. They enable core 
                  functionality such as security, authentication, and session management. The platform 
                  cannot function properly without these cookies.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Functional Cookies</h3>
                <p>
                  These cookies allow the platform to remember your preferences and choices, such as 
                  language settings and display preferences, to provide you with a more personalized 
                  experience.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Analytics Cookies</h3>
                <p>
                  These cookies help us understand how visitors interact with our platform by collecting 
                  and reporting information anonymously. This helps us improve the platform and identify 
                  areas for enhancement.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Performance Cookies</h3>
                <p>
                  These cookies collect information about how you use our platform, such as which pages 
                  you visit most often. This data is used to optimize the platform and improve performance.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Cookies</h2>
            <p>
              Some cookies are placed by third-party services that appear on our pages. We do not control 
              these cookies and recommend reviewing the privacy policies of these third-party services to 
              understand how they use cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
            <p className="mb-4">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Browser settings: Most browsers allow you to refuse or accept cookies</li>
              <li>Delete cookies: You can delete cookies that have already been set</li>
              <li>Block third-party cookies: Many browsers allow you to block third-party cookies</li>
            </ul>
            <p className="mt-4">
              Please note that blocking or deleting cookies may impact your ability to use certain features 
              of the CORQON platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Privacy and Data Protection</h2>
            <p>
              Cookies are used in accordance with our Privacy Policy. We are committed to privacy-safe 
              data practices and do not use cookies to track or profile individual employees. All data 
              collected through cookies is handled securely and used only for the purposes described in 
              this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology or 
              legal requirements. We will notify you of any material changes by posting the updated 
              policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <p className="mt-4">
              <a 
                href="mailto:info@corqon.com" 
                className="text-white/90 hover:text-white transition-colors underline"
              >
                info@corqon.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

