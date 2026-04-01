"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function RestockNotify() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to backend
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-xs text-jade mt-2">
        {t("shop.restock.success")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2 items-center">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email@example.com"
        className="flex-1 min-w-0 border border-vermillion/20 bg-soft-white px-3 py-2 text-xs text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-vermillion/50 transition-colors"
      />
      <button
        type="submit"
        className="shrink-0 px-4 py-2 text-[10px] uppercase tracking-[0.15em] bg-vermillion/10 text-vermillion-dark border border-vermillion/20 hover:bg-vermillion hover:text-soft-white hover:border-vermillion transition-all touch-target"
      >
        {t("shop.restock.btn")}
      </button>
    </form>
  );
}
