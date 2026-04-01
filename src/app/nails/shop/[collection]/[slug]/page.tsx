"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AnimateOnScroll, Stagger } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import {
  getProductBySlug,
  getProductsByCollection,
  getCollectionByHandle,
} from "@/lib/products";
import SizeGuide from "@/components/SizeGuide";

export default function ProductDetailPage() {
  const { t } = useI18n();
  const { addItem } = useCart();
  const params = useParams<{ collection: string; slug: string }>();
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const product = getProductBySlug(params.slug);
  const collection = getCollectionByHandle(params.collection);

  if (!product || !collection) {
    return (
      <section className="bg-soft-white py-20 px-4 text-center">
        <p className="text-warm-gray">Product not found.</p>
        <Link
          href="/nails/shop"
          className="mt-4 inline-block text-sm text-vermillion-dark underline-grow"
        >
          {t("shop.back.shop")}
        </Link>
      </section>
    );
  }

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  // Related products: same collection, exclude current
  const related = getProductsByCollection(product.collectionHandle)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.length > 0 ? `https://shimmyhands.com${product.images[0]}` : undefined,
    brand: {
      "@type": "Brand",
      name: "Shimmyhands",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "SGD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── Breadcrumb ─── */}
      <div className="bg-cream-dark/30 px-4 sm:px-6 py-3">
        <div className="mx-auto max-w-6xl">
          <Link
            href={`/nails/shop/${product.collectionHandle}`}
            className="text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors"
          >
            {t("shop.back.collection")}
          </Link>
        </div>
      </div>

      {/* ─── Product Detail ─── */}
      <section className="bg-soft-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl grid gap-8 sm:gap-12 md:grid-cols-2">
          {/* Image gallery */}
          <AnimateOnScroll animation="fade-right">
            <div>
              {/* Main image with arrow navigation */}
              <div className="relative aspect-square bg-gradient-to-br from-cream-dark/50 via-cream to-vermillion/5 overflow-hidden border border-vermillion/10 group/gallery">
                {product.images.length > 0 ? (
                  <Image
                    src={product.images[activeImage]}
                    alt={product.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl text-gold/20">✦</span>
                  </div>
                )}
                {/* Arrow navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-soft-white/80 text-charcoal hover:bg-soft-white transition-all opacity-0 group-hover/gallery:opacity-100 touch-target"
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setActiveImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-soft-white/80 text-charcoal hover:bg-soft-white transition-all opacity-0 group-hover/gallery:opacity-100 touch-target"
                      aria-label="Next image"
                    >
                      →
                    </button>
                    {/* Image counter */}
                    <div className="absolute bottom-2 right-2 bg-charcoal/60 text-soft-white text-[10px] px-2 py-1">
                      {activeImage + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </div>
              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setActiveImage(i)}
                      className={`relative aspect-square overflow-hidden border transition-all duration-200 ${
                        i === activeImage
                          ? "border-vermillion ring-1 ring-vermillion/30"
                          : "border-vermillion/10 hover:border-vermillion/30"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} — view ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimateOnScroll>

          {/* Product info */}
          <AnimateOnScroll animation="fade-left" delay={150}>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-warm-gray">
                {product.collection}
              </p>
              <h1 className="mt-2 font-serif text-3xl sm:text-4xl text-charcoal tracking-wide">
                {product.title}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="font-serif text-2xl text-vermillion-dark">
                  ${product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base text-warm-gray line-through">
                    ${product.compareAtPrice}
                  </span>
                )}
              </div>

              <p className="mt-6 text-sm sm:text-base leading-relaxed text-charcoal-light">
                {product.description}
              </p>

              {/* Add to Bag */}
              <button
                onClick={handleAdd}
                className={`mt-8 w-full sm:w-auto px-10 py-4 text-xs uppercase tracking-[0.2em] transition-all duration-300 touch-target ${
                  added
                    ? "bg-jade/20 text-jade border border-jade/30"
                    : "bg-vermillion text-soft-white hover:bg-vermillion-dark btn-magnetic shine-on-hover glow-pulse"
                }`}
              >
                {added ? t("shop.added") : t("shop.add")}
              </button>

              <SizeGuide />

              {/* Features, colours, hardware */}
              {(product.features.length > 0 || product.colours || product.hardware) && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {product.features.map((f) => (
                    <span key={f} className="text-[10px] uppercase tracking-[0.1em] text-vermillion-dark border border-vermillion/20 bg-vermillion/5 px-3 py-1.5">
                      {f}
                    </span>
                  ))}
                  {product.colours?.map((c) => (
                    <span key={c} className="text-[10px] uppercase tracking-[0.1em] text-charcoal-light border border-gold/20 bg-gold/5 px-3 py-1.5">
                      {c}
                    </span>
                  ))}
                  {product.hardware?.map((h) => (
                    <span key={h} className="text-[10px] uppercase tracking-[0.1em] text-charcoal-light border border-gold/20 bg-gold/5 px-3 py-1.5">
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {/* Product details */}
              <div className="mt-8 border-t border-gold/15 pt-6">
                <h3 className="text-xs uppercase tracking-[0.2em] text-vermillion-dark mb-3">
                  What&apos;s Included
                </h3>
                <ul className="space-y-2 text-sm text-charcoal-light">
                  <li className="flex items-start gap-2">
                    <span className="text-vermillion/60 mt-0.5">✦</span>
                    1 set of 10 handcrafted press-on nails
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-vermillion/60 mt-0.5">✦</span>
                    Nail glue &amp; adhesive tabs
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-vermillion/60 mt-0.5">✦</span>
                    Mini nail file &amp; prep pad
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-vermillion/60 mt-0.5">✦</span>
                    Application guide card
                  </li>
                </ul>
              </div>

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] uppercase tracking-[0.15em] text-warm-gray border border-gold/15 px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ─── You May Also Like ─── */}
      {related.length > 0 && (
        <>
          <div className="flex items-center justify-center gap-3 my-8">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-vermillion/30" />
            <span className="text-vermillion/40 text-xs">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-vermillion/30" />
          </div>

          <section className="bg-cream py-12 sm:py-16 px-4 sm:px-6">
            <div className="mx-auto max-w-6xl">
              <AnimateOnScroll animation="fade-up" className="text-center mb-10">
                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal">
                  {t("shop.also.like")}
                </h2>
              </AnimateOnScroll>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                <Stagger staggerMs={100} animation="fade-up">
                  {related.map((relProduct) => (
                    <Link
                      key={relProduct.id}
                      href={`/nails/shop/${relProduct.collectionHandle}/${relProduct.handle}`}
                      className="group card-lift shine-on-hover border border-vermillion/15 bg-cream/50 overflow-hidden hover:border-vermillion/40"
                    >
                      <div className="relative w-full aspect-square bg-gradient-to-br from-cream-dark/50 via-cream to-vermillion/5 overflow-hidden">
                        {relProduct.images.length > 0 ? (
                          <Image
                            src={relProduct.images[0]}
                            alt={relProduct.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center px-4">
                              <div className="mx-auto w-12 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mb-2" />
                              <p className="text-[9px] uppercase tracking-[0.3em] text-warm-gray/40">
                                {relProduct.title}
                              </p>
                              <div className="mx-auto w-12 h-[0.5px] bg-gradient-to-r from-transparent via-vermillion/20 to-transparent mt-2" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4 sm:p-5">
                        <h3 className="font-serif text-base sm:text-lg text-charcoal">
                          {relProduct.title}
                        </h3>
                        <span className="mt-2 block text-sm font-medium text-vermillion-dark">
                          ${relProduct.price}
                        </span>
                      </div>
                    </Link>
                  ))}
                </Stagger>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
