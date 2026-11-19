"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function RestockNotify({ productHandle }: { productHandle: string }) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || sending) return;
    setSending(true);
    setFailed(false);
    try {
      const res = await fetch("/api/notify-restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, product_handle: productHandle }),
      });
      if (res.ok) setSubmitted(true);
      else setFailed(true);
    } catch {
      setFailed(true);
    }
    setSending(false);
  };

  if (submitted) {
    return (
      <p className="text-xs text-jade mt-2">
        {t("shop.restock.success")}
      </p>
    );
  }

  return (
    <>
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
        disabled={sending}
        className="btn btn-secondary btn-sm shrink-0 touch-target"
      >
        {t("shop.restock.btn")}
      </button>
    </form>
    {failed && (
      <p role="alert" className="text-xs text-red-500 mt-1">
        {t("shop.restock.error")}
      </p>
    )}
    </>
  );
}
