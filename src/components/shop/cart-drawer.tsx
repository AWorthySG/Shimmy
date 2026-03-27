"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { t } = useI18n();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-charcoal/30 backdrop-blur-safe"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-soft-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/15 px-6 py-4">
          <h2 className="font-serif text-xl text-charcoal">{t("cart.title")}</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-charcoal-light hover:text-vermillion transition-colors touch-target p-2"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-4xl text-vermillion/20 mb-4">✦</div>
              <p className="text-sm text-warm-gray">{t("cart.empty")}</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex gap-4 border-b border-gold/10 pb-4"
                >
                  {/* Image placeholder */}
                  <div className="h-20 w-20 shrink-0 bg-gradient-to-br from-cream-dark/50 via-cream to-vermillion/5 flex items-center justify-center">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-warm-gray/40">
                      Photo
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-charcoal truncate">
                      {item.product.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-warm-gray">
                      {item.product.collection}
                    </p>
                    <p className="mt-1 text-sm text-vermillion-dark font-medium">
                      ${item.product.price}
                    </p>

                    {/* Quantity controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="h-7 w-7 flex items-center justify-center border border-gold/20 text-charcoal-light hover:border-vermillion hover:text-vermillion transition-colors text-sm"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-sm text-charcoal w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="h-7 w-7 flex items-center justify-center border border-gold/20 text-charcoal-light hover:border-vermillion hover:text-vermillion transition-colors text-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-warm-gray hover:text-vermillion transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gold/15 px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.15em] text-charcoal-light">
                {t("cart.subtotal")}
              </span>
              <span className="font-serif text-lg text-charcoal">
                ${cartTotal.toFixed(2)}
              </span>
            </div>
            <div className="relative group">
              <button
                disabled
                className="w-full bg-vermillion/40 px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-soft-white cursor-not-allowed"
              >
                {t("cart.checkout")}
              </button>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-charcoal text-soft-white text-[10px] px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Coming Soon
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
