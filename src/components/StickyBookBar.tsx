"use client";

import { useI18n } from "@/lib/i18n";

interface StickyBookBarProps {
  serviceName: string;
  href: string;
}

export default function StickyBookBar({ serviceName, href }: StickyBookBarProps) {
  const { t } = useI18n();
  return (
    <div className="fixed bottom-14 left-0 right-0 z-[80] sm:hidden flex items-center justify-between bg-soft-white border-t border-vermillion/15 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-4 h-14 mb-[env(safe-area-inset-bottom)]">
      <span className="text-xs text-charcoal font-medium truncate mr-3">
        {serviceName}
      </span>
      <a
        href={href}
        className="btn btn-primary btn-sm shrink-0"
      >
        {t("nav.book")}
      </a>
    </div>
  );
}
