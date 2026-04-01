"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { Product } from "./products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

const CART_KEY = "shimmyhands-cart";
const SESSION_KEY = "shimmy-cart-session";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) return JSON.parse(stored) as CartItem[];
  } catch {
    // ignore parse errors
  }
  return [];
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return "";
  }
}

async function fetchCartFromApi(sessionId: string): Promise<CartItem[] | null> {
  if (!sessionId) return null;
  try {
    const res = await fetch(`/api/cart?session=${encodeURIComponent(sessionId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data.items) && data.items.length > 0) {
      return data.items as CartItem[];
    }
    return null;
  } catch {
    return null;
  }
}

async function syncCartToApi(sessionId: string, items: CartItem[]): Promise<void> {
  if (!sessionId) return;
  try {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session: sessionId, items }),
    });
  } catch {
    // Sync failures are non-critical
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return loadCart();
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const hydrated = typeof window !== "undefined";

  // Refs for debounced sync
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionIdRef = useRef<string>("");
  const initialSyncDoneRef = useRef(false);

  // Initialize session ID and fetch remote cart on mount
  useEffect(() => {
    if (!hydrated) return;

    const sessionId = getOrCreateSessionId();
    sessionIdRef.current = sessionId;

    // Fetch remote cart and merge: API takes precedence if local is empty
    if (sessionId && !initialSyncDoneRef.current) {
      initialSyncDoneRef.current = true;
      fetchCartFromApi(sessionId).then((remoteItems) => {
        if (remoteItems) {
          setItems((localItems) => {
            if (localItems.length === 0) {
              // Local is empty, use remote
              saveCart(remoteItems);
              return remoteItems;
            }
            // Local has items, keep local (it's the primary store)
            return localItems;
          });
        }
      });
    }
  }, [hydrated]);

  // Persist to localStorage on change (only after hydration)
  useEffect(() => {
    if (hydrated) saveCart(items);
  }, [items, hydrated]);

  // Debounced sync to API on change (only after initial sync is done)
  useEffect(() => {
    if (!hydrated || !initialSyncDoneRef.current) return;

    const sessionId = sessionIdRef.current;
    if (!sessionId) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      syncCartToApi(sessionId, items);
    }, 500);

    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [items, hydrated]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
