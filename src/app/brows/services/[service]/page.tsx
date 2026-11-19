"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { BROW_SERVICES, getBrowService, serviceKeys } from "@/lib/brow-services";

const WHATSAPP = "6589308973";

export default function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service } = use(params);
  const { t } = useI18n();
  const s = getBrowService(service);
  if (!s) notFound();
  const k = serviceKeys(s);
  const title = t(k.title);
  const waText = encodeURIComponent(`Hi, I'd like to ask about ${t(k.title)}.`);
  const others = BROW_SERVICES.filter((o) => o.slug !== s.slug);

  return (
    <>
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-12 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/brows/services" className="text-xs uppercase tracking-button text-vermillion-dark hover:text-vermillion">
            {t("svcpage.detail.back")}
          </Link>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">{title}</h1>
          <p className="mt-4 text-sm sm:text-base text-charcoal-light leading-relaxed">{t(k.desc)}</p>

          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              [t("compare.price"), t(k.price)],
              [t("compare.duration"), t(k.duration)],
              [t("compare.longevity"), t(k.longevity)],
            ].map(([label, value]) => (
              <div key={label} className="border border-vermillion/15 bg-soft-white/70 px-2 py-3">
                <dt className="text-[10px] uppercase tracking-label text-warm-gray">{label}</dt>
                <dd className="mt-1 text-sm sm:text-base font-medium text-charcoal">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/brows#book" className="btn btn-primary btn-lg touch-target text-center">
              {t("svcpage.detail.book")}
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg touch-target text-center"
            >
              {t("cta.whatsapp")}
            </a>
          </div>
        </div>
      </section>

      {s.image && (
        <div className="relative mx-auto w-full max-w-3xl aspect-[2/1] overflow-hidden bg-cream-dark">
          <Image src={s.image} alt={`${title} at Shimmy Beauty Studio`} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
        </div>
      )}

      <section className="bg-soft-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-10">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">{t("svcpage.includes")}</h2>
            <ul className="mt-4 space-y-2 text-sm sm:text-base text-charcoal-light">
              {k.includes.map((key) => (
                <li key={key} className="flex gap-2">
                  <span className="text-vermillion" aria-hidden="true">✦</span>
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-charcoal">{t("faq.title")}</h2>
            <div className="mt-4 divide-y divide-vermillion/10 border-y border-vermillion/10">
              {k.faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="cursor-pointer list-none font-medium text-charcoal flex justify-between gap-4">
                    {t(f.q)}
                    <span className="text-vermillion transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 text-sm sm:text-base text-charcoal-light leading-relaxed">{t(f.a)}</p>
                </details>
              ))}
            </div>
          </div>

          {s.id !== "lip" && s.id !== "shaping" && (
            <Link href="/brows/try-on" className="inline-block text-sm uppercase tracking-button text-vermillion-dark hover:text-vermillion">
              {t("svcpage.detail.tryon")}
            </Link>
          )}

          <div>
            <h2 className="font-serif text-2xl text-charcoal">{t("svcpage.detail.other")}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/brows/services/${o.slug}`}
                    className="block border border-vermillion/15 bg-cream/40 px-3 py-3 text-sm text-charcoal hover:border-vermillion/40"
                  >
                    {t(`svc.${o.id}.title`)}
                    <span className="block text-xs text-warm-gray">{t(`svc.${o.id}.price`)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
