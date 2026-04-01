"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const sizes = [
  { label: "XS", width: "12–13" },
  { label: "S", width: "13–14" },
  { label: "M", width: "14–15" },
  { label: "L", width: "15–16" },
  { label: "XL", width: "16–17" },
];

export default function SizeGuide() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-xs uppercase tracking-[0.15em] text-vermillion-dark underline underline-offset-4 decoration-vermillion/30 hover:decoration-vermillion transition-colors"
      >
        {t("shop.sizeguide")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-cream border border-vermillion/20 p-6 sm:p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-xs uppercase tracking-[0.15em] text-warm-gray hover:text-vermillion transition-colors"
              aria-label={t("shop.sizeguide.close")}
            >
              {t("shop.sizeguide.close")}
            </button>

            <h2 className="font-serif text-xl sm:text-2xl text-charcoal mb-6">
              {t("shop.sizeguide.title")}
            </h2>

            {/* Size table */}
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b border-vermillion/20">
                  <th className="text-left text-[10px] uppercase tracking-[0.15em] text-vermillion-dark py-2">
                    Size
                  </th>
                  <th className="text-left text-[10px] uppercase tracking-[0.15em] text-vermillion-dark py-2">
                    Width (mm)
                  </th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((s) => (
                  <tr key={s.label} className="border-b border-gold/10">
                    <td className="py-2 text-charcoal font-medium">{s.label}</td>
                    <td className="py-2 text-charcoal-light">{s.width}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Measurement tip */}
            <p className="text-sm text-charcoal-light leading-relaxed mb-4">
              {t("shop.sizeguide.tip")}
            </p>

            {/* Blog link */}
            <Link
              href="/blog/how-to-choose-nail-size"
              className="inline-block text-xs uppercase tracking-[0.15em] text-vermillion-dark hover:text-vermillion transition-colors"
              onClick={() => setOpen(false)}
            >
              {t("shop.sizeguide.blog")}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
