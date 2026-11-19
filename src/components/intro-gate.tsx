"use client";

import { useCallback, useState, useSyncExternalStore, type ReactNode } from "react";

const noopSubscribe = () => () => {};

function introAlreadySeen(storageKey: string): boolean {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    return sessionStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

/**
 * Plays an intro animation once per browser session (never with reduced motion).
 * The page renders underneath from the start: the intro is an opaque full-screen
 * overlay, so hiding the content as well only delayed the first meaningful paint.
 */
export function IntroGate({
  storageKey,
  intro,
  children,
}: {
  storageKey: string;
  intro: (onComplete: () => void) => ReactNode;
  children: ReactNode;
}) {
  // Server render and first client render agree on "not seen"; the client value applies right after.
  const seen = useSyncExternalStore(noopSubscribe, () => introAlreadySeen(storageKey), () => false);
  const [done, setDone] = useState(false);

  const handleComplete = useCallback(() => {
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // Storage blocked: the intro simply plays again next time.
    }
    setDone(true);
  }, [storageKey]);

  return (
    <>
      {!seen && !done && intro(handleComplete)}
      {children}
    </>
  );
}
