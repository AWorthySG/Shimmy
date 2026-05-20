"use client";

import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { OverlayProvider } from "@/lib/overlay";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <CartProvider>
        <WishlistProvider>
          <OverlayProvider>{children}</OverlayProvider>
        </WishlistProvider>
      </CartProvider>
    </I18nProvider>
  );
}
