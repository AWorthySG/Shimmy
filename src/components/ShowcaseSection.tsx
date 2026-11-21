"use client";

import { useI18n } from "@/lib/i18n";
import ShowcaseStrip, { type ShowcaseItem } from "@/components/ShowcaseStrip";

export default function ShowcaseSection({ titleKey, items }: { titleKey: string; items: ShowcaseItem[] }) {
  const { t } = useI18n();
  return (
    <section className="bg-soft-white py-14 sm:py-20">
      <div className="reveal mx-auto mb-8 max-w-6xl px-4 sm:mb-10 sm:px-6">
        <p className="eyebrow">{t("showcase.tag")}</p>
        <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">{t(titleKey)}</h2>
      </div>
      <ShowcaseStrip items={items} label={t("showcase.label")} />
    </section>
  );
}
