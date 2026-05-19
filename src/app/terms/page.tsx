export default function TermsPage() {
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
            Terms of Service
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
              Welcome to Shimmy Beauty Studio. By accessing or using our website and
              services, you agree to be bound by these Terms of Service. If you do not
              agree with any part of these terms, please do not use our services.
            </p>
          </div>

          {/* 2. Services */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">2. Services</h2>
            <p>
              Shimmy Beauty Studio offers eyebrow embroidery, nano brows, ombre powder
              brows, and related beauty services, as well as handcrafted press-on nails.
              All bookings are subject to availability.
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                <strong>Cancellation Policy:</strong> We require at least 24 hours&apos;
                notice for cancellations or rescheduling. Failure to provide adequate
                notice may result in forfeiture of any deposit paid.
              </li>
              <li>
                <strong>No-Show Policy:</strong> Clients who fail to attend a confirmed
                appointment without prior notice will forfeit their deposit. Repeated
                no-shows may result in a requirement to pay the full service fee in
                advance for future bookings.
              </li>
            </ul>
          </div>

          {/* 3. Products */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">3. Products</h2>
            <p>
              Our press-on nail collections are handcrafted and made to order. Due to the
              nature of these products:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-2">
              <li>
                Returns are accepted only for unused and sealed items within 7 days of
                delivery.
              </li>
              <li>No refunds will be issued for opened or used items.</li>
              <li>
                If you receive a damaged or incorrect product, please contact us
                immediately via WhatsApp and we will arrange a replacement.
              </li>
            </ul>
          </div>

          {/* 4. Booking & Payment */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">4. Booking &amp; Payment</h2>
            <p>
              All bookings are confirmed via WhatsApp. Payment details will be shared
              during the booking process. Deposits may be required to secure your
              appointment. Full payment is due upon completion of services unless otherwise
              agreed.
            </p>
          </div>

          {/* 5. Intellectual Property */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">5. Intellectual Property</h2>
            <p>
              All content on this website — including but not limited to text, images,
              graphics, logos, nail designs, and photographs — is the property of Shimmy
              Beauty Studio and is protected by applicable intellectual property laws. You
              may not reproduce, distribute, or use any content without our prior written
              consent.
            </p>
          </div>

          {/* 6. Limitation of Liability */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">6. Limitation of Liability</h2>
            <p>
              Shimmy Beauty Studio provides all services with reasonable care and skill.
              However, individual results may vary due to factors such as skin type,
              aftercare adherence, and lifestyle. We are not liable for any adverse
              reactions resulting from undisclosed allergies, failure to follow pre- or
              post-care instructions, or any indirect, incidental, or consequential damages
              arising from the use of our services or products.
            </p>
          </div>

          {/* 7. Changes to Terms */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">7. Changes to Terms</h2>
            <p>
              We reserve the right to update or modify these Terms of Service at any time
              without prior notice. Changes will be effective immediately upon posting to
              this page. Your continued use of our services constitutes acceptance of any
              modified terms.
            </p>
          </div>

          {/* 8. Contact */}
          <div>
            <h2 className="font-serif text-xl text-charcoal mb-3">8. Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please reach out to
              us via WhatsApp at{" "}
              <a
                href="https://wa.me/6589308973"
                className="text-vermillion hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                +65 8930 8973
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
