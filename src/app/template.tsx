"use client";

import { useEffect, useState, type ReactNode } from "react";

// Set after the first page has mounted, so only later navigations animate in.
// Animating the first load would delay the largest paint.
let firstPageShown = false;

/** Fades each new page in after a client-side navigation. */
export default function Template({ children }: { children: ReactNode }) {
  const [animate] = useState(() => firstPageShown);
  useEffect(() => {
    firstPageShown = true;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
