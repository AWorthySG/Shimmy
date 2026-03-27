"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { t } = useI18n();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  // Build WhatsApp checkout message with cart contents
  const handleCheckout = () => {
    const lines = items.map(
      (item) => `• ${item.product.title} (${item.product.collection}) × ${item.quantity} — $${(item.product.price * item.quantity).toFixed(2)}`
    );
    const message = [
      "Hi! I'd like to order from Shimmyhands 💅",
      "",
      ...lines,
      "",
      `Total: $${cartTotal.toFixed(2)}`,
      "",
      "Could you help me confirm availability and arrange payment? Thank you!",
    ].join("\n");

    // TODO: Replace 6512345678 with your actual WhatsApp number
    const waUrl = `https://wa.me/6512345678?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

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
                  {/* Product image */}
                  <div className="relative h-20 w-20 shrink-0 bg-gradient-to-br from-cream-dark/50 via-cream to-vermillion/5 overflow-hidden">
                    {item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-warm-gray/40">
                          Photo
                        </span>
                      </div>
                    )}
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
          <div className="border-t border-gold/15 px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-[0.15em] text-charcoal-light">
                {t("cart.subtotal")}
              </span>
              <span className="font-serif text-lg text-charcoal">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout via WhatsApp */}
            <button
              onClick={handleCheckout}
              className="w-full bg-vermillion px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark transition-colors btn-magnetic shine-on-hover flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("cart.checkout")} via WhatsApp
            </button>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="w-full text-[10px] uppercase tracking-[0.2em] text-warm-gray hover:text-vermillion transition-colors py-2"
            >
              Clear Bag
            </button>
          </div>
        )}
      </div>
    </>
  );
}
