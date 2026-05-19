"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { products, type Product } from "@/lib/products";
import { useState } from "react";

function WishlistCard({ product }: { product: Product }) {
  const { toggleItem } = useWishlist();
  const { addItem } = useCart();
  const { t } = useI18n();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleRemove = (e: React.MouseEvent) => {
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

        {/* Remove button */}
        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 z-10 p-2 transition-all duration-200 hover:scale-110"
          aria-label="Remove from wishlist"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#e53e3e"
            stroke="#e53e3e"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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

export default function WishlistPage() {
  const { items } = useWishlist();

  const wishlistProducts = items
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => !!p);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark via-cream to-soft-white rice-paper px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            Saved Items
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide">
            Your Wishlist
          </h1>
        </div>
      </section>

      {/* Wishlist grid */}
      <section className="bg-soft-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {wishlistProducts.map((product) => (
                <WishlistCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="mx-auto w-14 h-14 flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-warm-gray/40">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
              <p className="text-warm-gray text-sm mb-6">Your wishlist is empty</p>
              <Link
                href="/nails/shop"
                className="inline-block px-6 py-3 text-[10px] uppercase tracking-[0.2em] bg-vermillion/10 text-vermillion-dark border border-vermillion/20 hover:bg-vermillion hover:text-soft-white hover:border-vermillion transition-all duration-300"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
