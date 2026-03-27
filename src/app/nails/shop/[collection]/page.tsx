"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AnimateOnScroll, Stagger } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import {
  getCollectionByHandle,
  getProductsByCollection,
  type Product,
} from "@/lib/products";

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
        <h3 className="font-serif text-base sm:text-lg text-charcoal">
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

export default function CollectionPage() {
  const { t } = useI18n();
  const params = useParams<{ collection: string }>();
  const collectionHandle = params.collection;

  const collection = getCollectionByHandle(collectionHandle);
  const collectionProducts = getProductsByCollection(collectionHandle);

  if (!collection) {
    return (
      <section className="bg-soft-white py-20 px-4 text-center">
        <p className="text-warm-gray">Collection not found.</p>
        <Link
          href="/nails/shop"
          className="mt-4 inline-block text-sm text-vermillion-dark underline-grow"
        >
          {t("shop.back.shop")}
        </Link>
      </section>
    );
  }

  return (
    <>
      {/* ─── Collection Header ─── */}
      <section className="bg-gradient-to-b from-cream-dark via-cream to-soft-white rice-paper px-4 sm:px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href="/nails/shop"
            className="inline-block text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors mb-6"
          >
            {t("shop.back.shop")}
          </Link>

          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide">
            {collection.title}
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed text-charcoal-light max-w-lg mx-auto">
            {collection.description}
          </p>
        </div>
      </section>

      {/* ─── Product Grid ─── */}
      <section className="bg-soft-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
            <Stagger staggerMs={100} animation="fade-up">
              {collectionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </>
  );
}
