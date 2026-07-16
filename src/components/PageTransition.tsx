"use client";

import { usePathname } from "next/navigation";

/**
 * Fades new route content in on navigation. Keying on the pathname remounts
 * the subtree so the CSS `page-fade-in` animation replays on each navigation —
 * a single gentle fade-in rather than a fade-out-then-in that briefly blanks
 * the page. The animation is disabled under prefers-reduced-motion (see
 * globals.css), so it degrades to an instant swap.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-fade-in">
      {children}
    </div>
  );
}
