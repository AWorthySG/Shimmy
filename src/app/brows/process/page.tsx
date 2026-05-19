"use client";

import Link from "next/link";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";

const appointmentSteps = [1, 2, 3, 4, 5, 6] as const;
const healingStages = [1, 2, 3, 4] as const;

function PhaseDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-4 my-4">
      <div className="h-[1px] flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-vermillion/30" />
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-vermillion-dark">{label}</span>
      <div className="h-[1px] flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-vermillion/30" />
    </div>
  );
}

function TimelineItem({
  number,
  title,
  time,
  desc,
  isLast,
}: {
  number: string | number;
  title: string;
  time?: string;
  desc: string;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-5 sm:gap-8">
      <div className="flex flex-col items-center shrink-0">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-vermillion/30 bg-cream text-vermillion font-serif text-base sm:text-lg">
          {number}
        </div>
        {!isLast && (
          <div className="w-[2px] flex-1 bg-gradient-to-b from-vermillion/20 to-vermillion/5 my-2" />
        )}
      </div>
      <div className={`pb-8 sm:pb-12 ${isLast ? "pb-0 sm:pb-0" : ""}`}>
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="font-serif text-lg sm:text-xl text-charcoal">{title}</h3>
          {time && (
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-warm-gray">
              {time}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-charcoal-light">{desc}</p>
      </div>
    </div>
  );
}

export default function ProcessPage() {
  const { t } = useI18n();

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-cream-dark to-cream rice-paper py-14 sm:py-20 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto h-[2px] w-[60px] bg-gradient-to-r from-transparent via-vermillion/60 to-transparent mb-4" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-vermillion-dark">
            {t("process.tag")}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-charcoal md:text-5xl shimmer-text">
            {t("process.title")}
          </h1>
        </div>
      </section>

      {/* ───────────── PHASE 1: Before Your Appointment ───────────── */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <AnimateOnScroll animation="fade-up">
            <PhaseDivider label={t("process.phase.1")} />
          </AnimateOnScroll>

          <div className="mt-10">
            <AnimateOnScroll animation="fade-up" delay={50}>
              <TimelineItem
                number={1}
                title={t("process.signup.title")}
                time={t("process.signup.time")}
                desc={t("process.signup.desc")}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={100}>
              <TimelineItem
                number={2}
                title={t("process.book.title")}
                time={t("process.book.time")}
                desc={t("process.book.desc")}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={150}>
              <TimelineItem
                number={3}
                title={t("process.prep.title")}
                time={t("process.prep.time")}
                desc={t("process.prep.desc")}
              />
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={200}>
              <TimelineItem
                number={4}
                title={t("process.bring.title")}
                desc={t("process.bring.desc")}
                isLast
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ───────────── PHASE 2: At the Studio ───────────── */}
      <section className="bg-cream py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <AnimateOnScroll animation="fade-up">
            <PhaseDivider label={t("process.phase.2")} />
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={50}>
            <p className="mt-8 mb-10 text-sm leading-relaxed text-charcoal-light text-center">
              {t("process.timeline")}
            </p>
          </AnimateOnScroll>

          {appointmentSteps.map((step, i) => (
            <AnimateOnScroll
              key={step}
              animation="fade-up"
              delay={i * 80}
            >
              <TimelineItem
                number={step}
                title={t(`process.step.${step}.title`)}
                time={t(`process.step.${step}.time`)}
                desc={t(`process.step.${step}.desc`)}
                isLast={i === appointmentSteps.length - 1}
              />
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* ───────────── PHASE 3: Your Healing Journey ───────────── */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <AnimateOnScroll animation="fade-up">
            <PhaseDivider label={t("process.phase.3")} />
          </AnimateOnScroll>

          <div className="mt-10">
            {healingStages.map((stage, i) => (
              <AnimateOnScroll
                key={stage}
                animation="fade-up"
                delay={i * 80}
              >
                <TimelineItem
                  number="✦"
                  title={t(`process.heal.${stage}.title`)}
                  desc={t(`process.heal.${stage}.desc`)}
                  isLast={i === healingStages.length - 1}
                />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── PHASE 4: The Touch-Up ───────────── */}
      <section className="bg-cream-dark py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <AnimateOnScroll animation="fade-up">
            <PhaseDivider label={t("process.phase.4")} />
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up" delay={50}>
            <div className="mt-10 border border-vermillion/15 bg-soft-white/60 p-6 sm:p-8 oriental-corner">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h2 className="font-serif text-xl sm:text-2xl text-charcoal">
                  {t("process.touchup.title")}
                </h2>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-warm-gray">
                  {t("process.touchup.time")}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-charcoal-light">
                {t("process.touchup.desc")}
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ───────────── PHASE 5: Long-Term Care ───────────── */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <AnimateOnScroll animation="fade-up">
            <PhaseDivider label={t("process.phase.5")} />
          </AnimateOnScroll>

          <div className="mt-10 grid gap-6 sm:gap-8">
            <AnimateOnScroll animation="fade-up" delay={50}>
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-charcoal">
                  {t("process.longterm.title")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
                  {t("process.longterm.desc")}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll animation="fade-up" delay={100}>
              <div>
                <h3 className="font-serif text-lg sm:text-xl text-charcoal">
                  {t("process.longterm.maintain.title")}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-light">
                  {t("process.longterm.maintain.desc")}
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Link to blog */}
          <AnimateOnScroll animation="fade-up" delay={200}>
            <p className="mt-10 text-center text-sm text-charcoal-light">
              {t("process.faq.cta")}{" "}
              <Link
                href="/blog"
                className="text-vermillion-dark hover:text-vermillion underline-grow transition-colors"
              >
                {t("process.faq.link")}
              </Link>
              .
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="bg-cream py-12 sm:py-16 px-4 sm:px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-xl sm:text-2xl text-charcoal md:text-3xl">
            {t("process.cta")}
          </h2>
          <div className="mt-6 sm:mt-8">
            <a
              href="https://wa.me/6589308973"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-magnetic glow-pulse shine-on-hover inline-flex items-center justify-center gap-2 bg-vermillion px-6 sm:px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-soft-white hover:bg-vermillion-dark touch-target"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {t("cta.whatsapp")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
