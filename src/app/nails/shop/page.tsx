"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimateOnScroll, Stagger } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { collections, products, type Product } from "@/lib/products";

function ProductCard({ product }: { product: Product }) {
  const { t } = useI18n();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
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

export default function ShopPage() {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? products
      : products.filter((p) => p.collectionHandle === activeFilter);

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
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
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
              </button>
            ))}
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
    </>
  );
}
