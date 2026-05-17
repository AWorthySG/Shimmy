"use client";

interface StickyBookBarProps {
  serviceName: string;
  href: string;
}

export default function StickyBookBar({ serviceName, href }: StickyBookBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80] sm:hidden flex items-center justify-between bg-soft-white border-t border-vermillion/15 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-4 h-14 mb-[env(safe-area-inset-bottom)]">
      <span className="text-xs text-charcoal font-medium truncate mr-3">
        {serviceName}
      </span>
      <a
        href={href}
        className="shrink-0 bg-vermillion text-soft-white px-5 py-2 text-xs uppercase tracking-[0.15em] font-medium hover:bg-vermillion-dark transition-colors"
      >
        Book Now
      </a>
    </div>
  );
}
