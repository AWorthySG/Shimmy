"use client";

import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <CartProvider>{children}</CartProvider>
    </I18nProvider>
  );
}
