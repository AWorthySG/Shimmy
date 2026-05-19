"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("shimmy-cookies-accepted")) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("shimmy-cookies-accepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-charcoal text-soft-white py-3 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs leading-relaxed">{t("cookie.text")}</p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={accept}
            className="bg-vermillion px-4 py-1.5 text-xs uppercase tracking-wider text-soft-white transition-colors hover:bg-vermillion-dark"
          >
            {t("cookie.accept")}
          </button>
          <Link
            href="/privacy"
            className="text-xs text-soft-white/70 underline underline-offset-2 transition-colors hover:text-soft-white"
          >
            {t("cookie.learn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
