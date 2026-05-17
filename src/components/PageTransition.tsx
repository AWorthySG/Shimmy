"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setVisible(false);
      const timeout = setTimeout(() => {
        setVisible(true);
        prevPathname.current = pathname;
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
