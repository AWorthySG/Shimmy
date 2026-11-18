"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <section className="bg-cream min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-5xl text-charcoal mb-4">404</h1>
        <h2 className="font-serif text-2xl text-charcoal mb-3">
          {t("notfound.title")}
        </h2>
        <p className="text-charcoal/70 mb-8">
          {t("notfound.desc")}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/brows"
            className="btn btn-secondary"
          >
            {t("notfound.brows")}
          </Link>
          <Link
            href="/nails"
            className="btn btn-secondary"
          >
            {t("notfound.nails")}
          </Link>
          <Link
            href="/nails/shop"
            className="btn btn-secondary"
          >
            {t("notfound.shop")}
          </Link>
          <Link
            href="/contact"
            className="btn btn-secondary"
          >
            {t("notfound.contact")}
          </Link>
        </div>
      </div>
    </section>
  );
}
