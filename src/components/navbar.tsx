"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import SearchOverlay from "@/components/SearchOverlay";

const browsLinks = [
  { href: "/brows", key: "nav.brows.studio" },
  { href: "/brows/services", key: "nav.services" },
  { href: "/brows/gallery", key: "nav.gallery" },
  { href: "/availability", key: "nav.availability" },
];

const nailsLinks = [
  { href: "/nails", key: "nav.nails.studio" },
  { href: "/nails/shop", key: "nav.shop" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [browsOpen, setBrowsOpen] = useState(false);
  const [nailsOpen, setNailsOpen] = useState(false);
  const [mobileBrowsOpen, setMobileBrowsOpen] = useState(false);
  const [mobileNailsOpen, setMobileNailsOpen] = useState(false);
  const { locale, toggleLocale, t } = useI18n();
  const { cartCount, setIsCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const browsRef = useRef<HTMLLIElement>(null);
  const nailsRef = useRef<HTMLLIElement>(null);

  // Close menus on navigation — syncing UI with external router state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with router
    setMobileOpen(false);
    setBrowsOpen(false);
    setNailsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (browsRef.current && !browsRef.current.contains(e.target as Node)) setBrowsOpen(false);
      if (nailsRef.current && !nailsRef.current.contains(e.target as Node)) setNailsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-soft-white/90 backdrop-blur-safe border-b border-gold/15 safe-top">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          {/* Small vermillion seal mark */}
          <div className="flex h-8 w-8 items-center justify-center border border-vermillion/60 bg-vermillion/5 transition-colors group-hover:bg-vermillion/10">
            <span className="font-serif text-xs text-vermillion font-semibold">美</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-serif text-xl sm:text-2xl tracking-wide text-charcoal">
              Shimmy
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-warm-gray">
              Beauty Studio
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {/* Brows dropdown */}
          <li ref={browsRef} className="relative">
            <button
              onClick={() => { setBrowsOpen(!browsOpen); setNailsOpen(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setBrowsOpen(!browsOpen); setNailsOpen(false); }
                else if (e.key === 'Escape') { setBrowsOpen(false); }
                else if (e.key === 'ArrowDown') { e.preventDefault(); setBrowsOpen(true); setNailsOpen(false); }
              }}
              aria-haspopup="true"
              aria-expanded={browsOpen}
              className={`flex items-center gap-1 text-sm uppercase tracking-[0.15em] transition-colors duration-300 underline-grow hover:text-vermillion ${
                pathname.startsWith("/brows") ? "text-vermillion font-medium" : "text-charcoal-light"
              }`}
            >
              {t("nav.brows")}
              <svg className={`w-3 h-3 transition-transform duration-200 ${browsOpen ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 5l3 3 3-3" />
              </svg>
            </button>
            {browsOpen && (
              <div role="menu" className="absolute top-full left-0 mt-2 w-48 bg-soft-white/95 backdrop-blur-safe border border-gold/15 shadow-lg py-2">
                {browsLinks.map(({ href, key }) => (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    className={`block px-4 py-2.5 text-xs uppercase tracking-[0.12em] transition-colors hover:text-vermillion hover:bg-vermillion/5 ${
                      pathname === href ? "text-vermillion font-medium" : "text-charcoal-light"
                    }`}
                  >
                    {t(key)}
                  </Link>
                ))}
              </div>
            )}
          </li>

          {/* Nails dropdown */}
          <li ref={nailsRef} className="relative">
            <button
              onClick={() => { setNailsOpen(!nailsOpen); setBrowsOpen(false); }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setNailsOpen(!nailsOpen); setBrowsOpen(false); }
                else if (e.key === 'Escape') { setNailsOpen(false); }
                else if (e.key === 'ArrowDown') { e.preventDefault(); setNailsOpen(true); setBrowsOpen(false); }
              }}
              aria-haspopup="true"
              aria-expanded={nailsOpen}
              className={`flex items-center gap-1 text-sm uppercase tracking-[0.15em] transition-colors duration-300 underline-grow hover:text-vermillion ${
                pathname.startsWith("/nails") ? "text-vermillion font-medium" : "text-charcoal-light"
              }`}
            >
              {t("nav.nails")}
              <svg className={`w-3 h-3 transition-transform duration-200 ${nailsOpen ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 5l3 3 3-3" />
              </svg>
            </button>
            {nailsOpen && (
              <div role="menu" className="absolute top-full left-0 mt-2 w-48 bg-soft-white/95 backdrop-blur-safe border border-gold/15 shadow-lg py-2">
                {nailsLinks.map(({ href, key }) => (
                  <Link
                    key={href}
                    href={href}
                    role="menuitem"
                    className={`block px-4 py-2.5 text-xs uppercase tracking-[0.12em] transition-colors hover:text-vermillion hover:bg-vermillion/5 ${
                      pathname === href ? "text-vermillion font-medium" : "text-charcoal-light"
                    }`}
                  >
                    {t(key)}
                  </Link>
                ))}
              </div>
            )}
          </li>

          {/* About */}
          <li>
            <Link
              href="/about"
              className={`text-sm uppercase tracking-[0.15em] transition-colors duration-300 underline-grow hover:text-vermillion ${
                pathname === "/about" ? "text-vermillion font-medium" : "text-charcoal-light"
              }`}
            >
              {t("nav.about")}
            </Link>
          </li>

          {/* Contact */}
          <li>
            <Link
              href="/contact"
              className={`text-sm uppercase tracking-[0.15em] transition-colors duration-300 underline-grow hover:text-vermillion ${
                pathname === "/contact" ? "text-vermillion font-medium" : "text-charcoal-light"
              }`}
            >
              {t("nav.contact")}
            </Link>
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          {/* Search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            className="relative text-charcoal-light transition-colors hover:text-vermillion touch-target p-2"
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Wishlist icon */}
          <Link
            href="/wishlist"
            className="relative text-charcoal-light transition-colors hover:text-vermillion touch-target p-2"
            aria-label="Wishlist"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-vermillion text-[9px] font-medium text-soft-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-charcoal-light transition-colors hover:text-vermillion touch-target p-2"
            aria-label="Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-vermillion text-[9px] font-medium text-soft-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Dark mode toggle */}
          <DarkModeToggle />

          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className="text-xs uppercase tracking-[0.15em] text-charcoal-light transition-colors hover:text-vermillion touch-target px-2 py-1 border border-vermillion/20 hover:border-vermillion/50"
            aria-label="Toggle language"
          >
            {locale === "en" ? "中文" : "EN"}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            className="relative text-charcoal-light transition-colors hover:text-vermillion touch-target p-2"
            aria-label="Search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Wishlist icon */}
          <Link
            href="/wishlist"
            className="relative text-charcoal-light transition-colors hover:text-vermillion touch-target p-2"
            aria-label="Wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-vermillion text-[9px] font-medium text-soft-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-charcoal-light transition-colors hover:text-vermillion touch-target p-2"
            aria-label="Cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-vermillion text-[9px] font-medium text-soft-white">
                {cartCount}
              </span>
            )}
          </button>

          <DarkModeToggle />

          <button
            onClick={toggleLocale}
            className="text-[10px] uppercase tracking-[0.1em] text-charcoal-light px-2 py-1.5 border border-vermillion/20 touch-target"
            aria-label="Toggle language"
          >
            {locale === "en" ? "中文" : "EN"}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1.5 p-3 touch-target"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className={`block h-[1.5px] w-6 bg-charcoal transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block h-[1.5px] w-6 bg-charcoal transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[1.5px] w-6 bg-charcoal transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu — backdrop overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-[57px] z-30 bg-charcoal/50 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu — bottom sheet */}
      <div
        className={`lg:hidden fixed inset-x-0 bottom-0 top-[57px] z-40 flex flex-col justify-end transition-transform duration-300 ease-out pointer-events-none ${
          mobileOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="pointer-events-auto bg-soft-white overflow-y-auto max-h-full safe-bottom rounded-t-2xl shadow-2xl">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-warm-gray/30" />
          </div>

          <div className="px-6 pb-8">
            {/* Brows group */}
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-warm-gray mb-2">{t("nav.brows")}</p>
              <ul className="space-y-1">
                {browsLinks.map(({ href, key }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 text-base tracking-wide border-b border-gold/8 touch-target ${
                        pathname === href ? "text-vermillion font-medium" : "text-charcoal-light"
                      }`}
                    >
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nails group */}
            <div className="mb-5">
              <p className="text-[10px] uppercase tracking-[0.25em] text-warm-gray mb-2">{t("nav.nails")}</p>
              <ul className="space-y-1">
                {nailsLinks.map(({ href, key }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 text-base tracking-wide border-b border-gold/8 touch-target ${
                        pathname === href ? "text-vermillion font-medium" : "text-charcoal-light"
                      }`}
                    >
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info group */}
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-warm-gray mb-2">{t("nav.mobile.info")}</p>
              <ul className="space-y-1">
                {[
                  { href: "/about", key: "nav.about" },
                  { href: "/blog", key: "nav.mobile.blog" },
                  { href: "/contact", key: "nav.contact" },
                ].map(({ href, key }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 text-base tracking-wide border-b border-gold/8 touch-target ${
                        pathname === href ? "text-vermillion font-medium" : "text-charcoal-light"
                      }`}
                    >
                      {t(key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/6589308973"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 border border-vermillion bg-vermillion/5 px-5 py-4 text-xs uppercase tracking-[0.2em] text-vermillion-dark touch-target"
              >
                {t("cta.whatsapp")}
              </a>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center bg-vermillion px-5 py-4 text-xs uppercase tracking-[0.2em] text-soft-white touch-target"
              >
                {t("nav.book")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Search Overlay */}
      {searchOpen && <SearchOverlay onClose={closeSearch} />}
    </header>
  );
}
