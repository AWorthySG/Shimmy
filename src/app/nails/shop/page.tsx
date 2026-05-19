"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Stagger } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { collections, products, type Product } from "@/lib/products";
import EmailCapture from "@/components/EmailCapture";
import RestockNotify from "@/components/RestockNotify";

function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const wishlisted = isInWishlist(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <Link
      href={`/nails/shop/${product.collectionHandle}/${product.handle}`}
      className="group card-lift shine-on-hover border border-vermillion/15 bg-cream/50 overflow-hidden hover:border-vermillion/40"
    >
      {/* Product image */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-cream-dark/50 via-cream to-vermillion/5 overflow-hidden">
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center px-4">
              <div className="mx-auto w-12 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mb-2" />
              <p className="text-[9px] uppercase tracking-[0.3em] text-warm-gray/40">
                {product.title}
              </p>
              <div className="mx-auto w-12 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mt-2" />
            </div>
          </div>
        )}

        {/* Wishlist heart button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 p-2 transition-all duration-200 hover:scale-110"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#e53e3e" : "none"}
            stroke={wishlisted ? "#e53e3e" : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={wishlisted ? "" : "text-charcoal/60 drop-shadow-sm"}
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-[9px] uppercase tracking-[0.2em] text-warm-gray">
          {product.collection}
        </p>
        <h3 className="mt-1 font-serif text-base sm:text-lg text-charcoal">
          {product.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-medium text-vermillion-dark">
            ${product.price}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-warm-gray line-through">
              ${product.compareAtPrice}
            </span>
          )}
        </div>
        {/* Limited stock badge (Task 6) */}
        {limitedStockCollections[product.collectionHandle] && (
          <>
            <span className="inline-block text-[10px] text-red-500 font-medium mt-1">
              {t("urgency.nails")}
            </span>
            <RestockNotify />
          </>
        )}

        <button
          onClick={handleAdd}
          className={`mt-3 w-full py-2.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 touch-target ${
            added
              ? "bg-jade/20 text-jade border border-jade/30"
              : "bg-vermillion/10 text-vermillion-dark border border-vermillion/20 hover:bg-vermillion hover:text-soft-white hover:border-vermillion"
          }`}
        >
          {added ? t("shop.added") : t("shop.add")}
        </button>
      </div>
    </Link>
  );
}

// TODO: Set limitedStock to true for collections with low stock — studio owner controls this
const limitedStockCollections: Record<string, boolean> = {
  'yule-dreams': true,
  'christmas-wishes': false,
  'sweater-weather': false,
  'lovers-heartbeat': false,
  'ingenue': false,
}

type SortOption = "newest" | "price-asc" | "price-desc";

const ALL_COLOURS = [
  "Evergreen", "Mulled Wine", "Midnight", "Amethyst",
  "Baby Blue", "Sweet Mint", "Milky Lavender", "Cool Dawn",
  "Warm Sunset", "Peach", "Nude", "Blush",
];

export default function ShopPage() {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedColours, setSelectedColours] = useState<string[]>([]);

  const toggleColour = (colour: string) => {
    setSelectedColours((prev) =>
      prev.includes(colour)
        ? prev.filter((c) => c !== colour)
        : [...prev, colour]
    );
  };

  const filtered = useMemo(() => {
    let result = activeFilter === "all"
      ? [...products]
      : products.filter((p) => p.collectionHandle === activeFilter);

    // Apply colour filter (AND with collection)
    if (selectedColours.length > 0) {
      result = result.filter((p) =>
        p.colours?.some((c) => selectedColours.includes(c))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        // Keep original order (newest)
        break;
    }

    return result;
  }, [activeFilter, sortBy, selectedColours]);

  // Compute min price per collection for "From $X" display (Task 2)
  const collectionMinPrices = useMemo(() => {
    const prices: Record<string, number> = {};
    for (const p of products) {
      if (!prices[p.collectionHandle] || p.price < prices[p.collectionHandle]) {
        prices[p.collectionHandle] = p.price;
      }
    }
    return prices;
  }, []);

  return (
    <>
      {/* ─── Header ─── */}
      <section className="bg-gradient-to-b from-cream-dark via-cream to-soft-white rice-paper px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t("nails.shop.tag")}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide">
            {t("nails.shop.title")}
          </h1>
        </div>
      </section>

      {/* ─── Filter Tabs ─── */}
      <section className="bg-soft-white border-b border-gold/15 sticky top-[57px] z-30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
          {/* Collection filters + Sort dropdown row */}
          <div className="flex items-center gap-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1 flex-1">
              <button
                onClick={() => setActiveFilter("all")}
                className={`shrink-0 px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition-all duration-300 touch-target ${
                  activeFilter === "all"
                    ? "bg-vermillion text-soft-white"
                    : "border border-vermillion/20 text-charcoal-light hover:border-vermillion hover:text-vermillion"
                }`}
              >
                {t("shop.all")}
              </button>
              {collections.map((c) => (
                <button
                  key={c.handle}
                  onClick={() => setActiveFilter(c.handle)}
                  className={`shrink-0 px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap touch-target ${
                    activeFilter === c.handle
                      ? "bg-vermillion text-soft-white"
                      : "border border-vermillion/20 text-charcoal-light hover:border-vermillion hover:text-vermillion"
                  }`}
                >
                  {c.title}
                  {collectionMinPrices[c.handle] && (
                    <span className="ml-1.5 text-[9px] opacity-70">
                      From ${collectionMinPrices[c.handle]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 text-[10px] uppercase tracking-[0.15em] border border-vermillion/20 bg-soft-white text-charcoal-light hover:border-vermillion hover:text-vermillion transition-all duration-300 cursor-pointer focus:outline-none focus:border-vermillion/50 appearance-none pr-7"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.2'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                }}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Colour filter chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-2 pb-1 -mx-1 px-1">
            {ALL_COLOURS.map((colour) => (
              <button
                key={colour}
                onClick={() => toggleColour(colour)}
                className={`shrink-0 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] transition-all duration-300 whitespace-nowrap touch-target ${
                  selectedColours.includes(colour)
                    ? "bg-vermillion text-soft-white"
                    : "border border-vermillion/15 text-charcoal-light hover:border-vermillion/40 hover:text-vermillion"
                }`}
              >
                {colour}
              </button>
            ))}
            {selectedColours.length > 0 && (
              <button
                onClick={() => setSelectedColours([])}
                className="shrink-0 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-warm-gray hover:text-vermillion transition-colors touch-target"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Product Grid ─── */}
      <section className="bg-soft-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            <Stagger staggerMs={80} animation="fade-up">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Stagger>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-warm-gray text-sm">No products found.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Email Capture (Task 7) ─── */}
      <section className="bg-cream py-12 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h3 className="font-serif text-lg sm:text-xl text-charcoal">
            {t("email.heading")}
          </h3>
          <div className="mt-6">
            <EmailCapture />
          </div>
        </div>
      </section>
    </>
  );
}
