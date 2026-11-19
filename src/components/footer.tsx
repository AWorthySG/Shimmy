"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { ArrowRight, MapPin } from "@/components/icons";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("37 Grace Walk, Verdana Villas, Singapore");

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-charcoal/10 bg-cream-dark text-charcoal-light safe-bottom">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand and booking */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <p className="font-serif text-2xl text-charcoal">Shimmy</p>
              <span className="inline-flex items-center justify-center w-7 h-7 border border-vermillion/60 text-vermillion text-xs font-serif leading-none" aria-hidden="true">
                美
              </span>
            </div>
            <p className="mt-1 text-[10px] uppercase tracking-eyebrow text-vermillion-dark">Beauty Studio</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-warm-gray">{t("footer.desc")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/brows#book" className="btn btn-primary btn-sm">
                {t("nav.book")}
              </Link>
              <div className="flex items-center">
              <a
                href="https://wa.me/6589308973"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-gray transition-colors hover:text-vermillion touch-target p-2"
                aria-label="WhatsApp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/shimmyhands.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-warm-gray transition-colors hover:text-vermillion touch-target p-2"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              </div>
            </div>
          </div>

          {/* Visit */}
          <div className="lg:col-span-3">
            <h2 className="eyebrow mb-4">{t("footer.visit")}</h2>
            <address className="not-italic text-sm leading-relaxed text-charcoal-light">
              <span className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-vermillion" />
                <span>
                  {t("contact.visit.address.1")}
                  <br />
                  {t("contact.visit.address.2")}
                </span>
              </span>
            </address>
            <p className="mt-3 text-xs text-warm-gray">{t("footer.appointment")}</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-button text-vermillion-dark hover:text-vermillion touch-target py-2"
            >
              {t("footer.directions")}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <p className="mt-1 text-sm text-charcoal-light">
              <a href="https://wa.me/6589308973" target="_blank" rel="noopener noreferrer" className="hover:text-vermillion touch-target inline-flex items-center py-1">
                WhatsApp +65 8930 8973
              </a>
            </p>
          </div>

          {/* Hours */}
          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-4">{t("footer.hours")}</h2>
            <dl className="space-y-3 text-sm">
              {[
                ["contact.hours.mf", "contact.hours.mf.time"],
                ["contact.hours.sat", "contact.hours.sat.time"],
                ["contact.hours.sun", "contact.hours.sun.time"],
              ].map(([day, time]) => (
                <div key={day}>
                  <dt className="text-charcoal">{t(day)}</dt>
                  <dd className="text-warm-gray">{t(time)}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Explore */}
          <nav className="lg:col-span-3" aria-label={t("footer.explore")}>
            <h2 className="eyebrow mb-4">{t("footer.explore")}</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 lg:grid-cols-1">
              {[
                { href: "/brows/services", label: t("nav.services") },
                { href: "/brows/gallery", label: t("nav.gallery") },
                { href: "/nails/shop", label: t("nav.shop") },
                { href: "/blog", label: t("blog.title") },
                { href: "/about", label: t("nav.about") },
                { href: "/contact", label: t("nav.contact") },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-charcoal-light transition-colors hover:text-vermillion touch-target inline-flex items-center py-1">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 border-t border-charcoal/10 pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-warm-gray">
            {[
              { href: "/gift-cards", label: t("nav.gift.cards") },
              { href: "/referral", label: t("nav.referral") },
              { href: "/loyalty", label: t("nav.loyalty") },
              { href: "/wishlist", label: t("nav.wishlist") },
              { href: "/terms", label: "Terms" },
              { href: "/privacy", label: "Privacy" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-vermillion touch-target inline-flex items-center py-1">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <p className="text-xs text-warm-gray">
              &copy; {new Date().getFullYear()} Shimmy. {t("footer.rights")}
            </p>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
