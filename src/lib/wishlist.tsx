"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

interface WishlistContextType {
  items: string[];
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

const WISHLIST_KEY = "shimmy-wishlist";

function loadWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (stored) return JSON.parse(stored) as string[];
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveWishlist(ids: string[]) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage errors
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return loadWishlist();
  });

  const hydrated = typeof window !== "undefined";

  useEffect(() => {
    if (hydrated) saveWishlist(items);
  }, [items, hydrated]);

  const toggleItem = useCallback((productId: string) => {
    setItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => items.includes(productId),
    [items],
  );

  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, toggleItem, isInWishlist, count }}>
      {children}
    </WishlistContext.Provider>
  );
}
