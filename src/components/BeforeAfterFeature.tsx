"use client";

import { useI18n } from "@/lib/i18n";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

/** Text beside the drag-to-compare slider. The photo's top half is "before", the bottom half "after". */
export default function BeforeAfterFeature({ tone = "cream" }: { tone?: "cream" | "white" }) {
  const { t } = useI18n();
  return (
    <section className={`${tone === "cream" ? "bg-cream" : "bg-soft-white"} py-14 sm:py-20 px-4 sm:px-6`}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-12 md:gap-14">
        <div className="reveal md:col-span-5">
          <p className="eyebrow">{t("ba.tag")}</p>
          <h2 className="mt-3 font-serif text-3xl text-charcoal md:text-4xl">{t("ba.title")}</h2>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-light sm:text-base">{t("ba.desc")}</p>
        </div>
        <div className="reveal md:col-span-7">
          <BeforeAfterSlider
            src="/images/brows/brow-before-after-closeup-clean.jpg"
            width={518}
            height={690}
            alt={t("ba.alt")}
            beforeLabel={t("ba.before")}
            afterLabel={t("ba.after")}
          />
        </div>
      </div>
    </section>
  );
}
