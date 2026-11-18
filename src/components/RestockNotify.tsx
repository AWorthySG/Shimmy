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
        className="field flex-1 min-w-0"
      />
      <button
        type="submit"
        className="btn btn-secondary btn-sm shrink-0 touch-target"
      >
        {t("shop.restock.btn")}
      </button>
    </form>
  );
}
