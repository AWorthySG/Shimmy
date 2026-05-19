export default function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            Legal
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-charcoal md:text-5xl shimmer-text">
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-soft-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-10 text-sm leading-relaxed text-charcoal-light">
          <p className="text-xs text-warm-gray">Last updated: May 2026</p>

          {/* 1. Introduction */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">1. Introduction</h2>
            <p>
              Shimmy Beauty Studio (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains what
              personal data we collect, how we use it, and your rights regarding your
              information when you use our website and services.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, and phone
                number provided when making bookings or enquiries.
              </li>
              <li>
                <strong>Browsing Data:</strong> Cookies, analytics data, pages visited,
                and device information collected automatically when you browse our website.
              </li>
            </ul>
          </div>

          {/* 3. How We Use Your Information */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>Process and manage your bookings</li>
              <li>Send booking confirmations and reminders</li>
              <li>Respond to your enquiries via WhatsApp or email</li>
              <li>Improve our website, services, and user experience</li>
              <li>Send promotional updates (only with your consent)</li>
            </ul>
          </div>

          {/* 4. Cookies */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">4. Cookies</h2>
            <p>
              Our website uses cookies and similar technologies to enhance your browsing
              experience. Specifically:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                <strong>Google Analytics (GA4):</strong> We use GA4 to collect anonymised
                usage data such as page views, session duration, and traffic sources. This
                helps us understand how visitors interact with our site.
              </li>
              <li>
                <strong>localStorage:</strong> We use browser localStorage to save your
                preferences (e.g., language selection, cookie consent status).
              </li>
            </ul>
            <p className="mt-3">
              You can manage or disable cookies through your browser settings. Please note
              that disabling cookies may affect the functionality of our website.
            </p>
          </div>

          {/* 5. Third-Party Services */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">5. Third-Party Services</h2>
            <p>We use the following third-party services to operate our website:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                <strong>Supabase:</strong> Database and data storage for bookings and user
                information.
              </li>
              <li>
                <strong>Vercel:</strong> Website hosting and deployment.
              </li>
              <li>
                <strong>Resend:</strong> Transactional email delivery for booking
                confirmations and notifications.
              </li>
            </ul>
            <p className="mt-3">
              These services have their own privacy policies. We encourage you to review
              them for details on how they handle your data.
            </p>
          </div>

          {/* 6. Data Retention */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">6. Data Retention</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Booking data:</strong> Retained for up to 2 years after your last
                appointment for record-keeping and follow-up purposes.
              </li>
              <li>
                <strong>Email subscriptions:</strong> Retained until you unsubscribe or
                request removal.
              </li>
              <li>
                <strong>Analytics data:</strong> Retained in accordance with Google
                Analytics&apos; data retention settings.
              </li>
            </ul>
          </div>

          {/* 7. Your Rights */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Withdraw consent for marketing communications at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us using the details below.
            </p>
          </div>

          {/* 8. Contact */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">8. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy or wish to exercise your
              data rights, please contact us:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/6589308973"
                  className="text-vermillion hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +65 8930 8973
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:hello@shimmyhands.com"
                  className="text-vermillion hover:underline"
                >
                  hello@shimmyhands.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
