"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { products } from "@/lib/products";
import { blogPosts } from "@/lib/blog";
import { useI18n } from "@/lib/i18n";

interface SearchResult {
  type: "Product" | "Article" | "Page";
  title: string;
  href: string;
}

const PAGES: SearchResult[] = [
  { type: "Page", title: "Brows", href: "/brows" },
  { type: "Page", title: "Nails", href: "/nails" },
  { type: "Page", title: "Services", href: "/brows/services" },
  { type: "Page", title: "About", href: "/about" },
  { type: "Page", title: "Contact", href: "/contact" },
  { type: "Page", title: "Blog", href: "/blog" },
  { type: "Page", title: "Shop", href: "/nails/shop" },
];

const MAX_RESULTS = 8;

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Escape key to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const found: SearchResult[] = [];

    // Search products
    for (const p of products) {
      if (found.length >= MAX_RESULTS) break;
      const searchable = [p.title, p.collection, ...(p.tags || [])].join(" ").toLowerCase();
      if (searchable.includes(lower)) {
        found.push({
          type: "Product",
          title: p.title,
          href: `/nails/shop/${p.collectionHandle}/${p.handle}`,
        });
      }
    }

    // Search blog articles
    for (const post of blogPosts) {
      if (found.length >= MAX_RESULTS) break;
      const titleText = post.titleKey;
      const descText = post.descKey;
      // Also search the slug which contains meaningful words
      const searchable = [titleText, descText, post.slug.replace(/-/g, " ")].join(" ").toLowerCase();
      if (searchable.includes(lower)) {
        found.push({
          type: "Article",
          title: post.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          href: `/blog/${post.slug}`,
        });
      }
    }

    // Search pages
    for (const page of PAGES) {
      if (found.length >= MAX_RESULTS) break;
      if (page.title.toLowerCase().includes(lower)) {
        found.push(page);
      }
    }

    setResults(found.slice(0, MAX_RESULTS));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 200);
  };

  const typeBadgeColor = (type: string) => {
    switch (type) {
      case "Product": return "bg-vermillion/10 text-vermillion-dark";
      case "Article": return "bg-jade/10 text-jade";
      case "Page": return "bg-gold/20 text-charcoal-light";
      default: return "bg-warm-gray/10 text-warm-gray";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal: full-screen on mobile, centered on desktop */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-xl sm:mt-24 bg-soft-white sm:border sm:border-gold/15 sm:shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gold/15 px-4 py-3 sm:px-6 sm:py-4">
          {/* Search icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-warm-gray shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search products, articles, pages..."
            className="flex-1 bg-transparent text-sm text-charcoal placeholder:text-warm-gray/50 outline-none"
          />
          <button
            onClick={onClose}
            className="p-2 text-charcoal-light hover:text-vermillion transition-colors touch-target"
            aria-label="Close search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          {query.trim() && results.length === 0 && (
            <p className="text-sm text-warm-gray text-center py-8">No results found</p>
          )}

          {results.length > 0 && (
            <ul className="space-y-1">
              {results.map((r, i) => (
                <li key={`${r.href}-${i}`}>
                  <Link
                    href={r.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-3 hover:bg-cream/70 transition-colors rounded-sm"
                  >
                    <span className={`shrink-0 px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] font-medium ${typeBadgeColor(r.type)}`}>
                      {r.type}
                    </span>
                    <span className="text-sm text-charcoal truncate">{r.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!query.trim() && (
            <p className="text-xs text-warm-gray text-center py-6">
              Start typing to search...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
