"use client";

import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { useI18n } from "@/lib/i18n";

export default function AvailabilityPage() {
  const { t } = useI18n();

  /* TODO: Replace with your actual availability data */
  const weekSchedule = [
    { day: t("contact.hours.mf"), time: t("contact.hours.mf.time"), available: true },
    { day: t("contact.hours.sat"), time: t("contact.hours.sat.time"), available: true },
    { day: t("contact.hours.sun"), time: t("contact.hours.sun.time"), available: false },
  ];

  /* TODO: Replace with your actual upcoming availability slots */
  const upcomingSlots = [
    { date: "Mon, 24 Mar", slots: ["10:00 AM", "2:00 PM", "4:30 PM"] },
    { date: "Tue, 25 Mar", slots: ["11:00 AM", "3:00 PM"] },
    { date: "Wed, 26 Mar", slots: ["10:00 AM", "1:00 PM", "3:30 PM", "5:00 PM"] },
    { date: "Thu, 27 Mar", slots: ["10:30 AM", "2:30 PM"] },
    { date: "Fri, 28 Mar", slots: ["10:00 AM", "12:00 PM", "3:00 PM", "5:30 PM"] },
    { date: "Sat, 29 Mar", slots: ["10:00 AM", "12:30 PM", "2:00 PM"] },
  ];

  return (
    <>
      {/* ─── Header ─── */}
      <section className="bg-gradient-to-b from-cream-dark via-cream to-soft-white rice-paper py-16 sm:py-20 md:py-24 px-4 sm:px-6 text-center">
        <AnimateOnScroll animation="fade-up">
          <p className="eyebrow">
            {t("nav.availability")}
          </p>
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">
            {t("nav.availability")}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-charcoal-light">
            {t("availability.desc")}
          </p>
        </AnimateOnScroll>
      </section>

      {/* ─── Studio Hours ─── */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <AnimateOnScroll animation="fade-up">
            <p className="eyebrow text-center">
              {t("contact.hours.tag")}
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-charcoal text-center">
              {t("contact.hours.tag")}
            </h2>
          </AnimateOnScroll>

          <div className="mt-10 space-y-4">
            {weekSchedule.map((item, i) => (
              <AnimateOnScroll key={item.day} animation="fade-up" delay={i * 100}>
                <div className="flex items-center justify-between border border-vermillion/15 bg-cream/30 px-6 py-5 oriental-corner">
                  <div>
                    <p className="font-sans font-medium text-lg text-charcoal">{item.day}</p>
                    <p className="mt-1 text-sm text-warm-gray">{item.time}</p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-label px-3 py-1 border ${
 item.available
 ?"text-jade border-jade/30 bg-jade/5"
 :"text-warm-gray border-warm-gray/20 bg-warm-gray/5"
 }`}>
                    {item.available ? "Open" : "By appt"}
                  </span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Upcoming Available Slots ─── */}
      <section className="bg-cream py-14 sm:py-20 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <AnimateOnScroll animation="fade-up">
            <p className="eyebrow text-center">
              This week
            </p>
            <h2 className="mt-3 font-serif text-2xl sm:text-3xl text-charcoal text-center">
              Available slots
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-center text-charcoal-light">
              Pick a time that suits you, then message us to confirm your booking.
            </p>
          </AnimateOnScroll>

          {/* ─── Decorative divider ─── */}
          <div className="mx-auto my-8 h-px w-16 bg-vermillion/30" aria-hidden="true" />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingSlots.map((day, i) => (
              <AnimateOnScroll key={day.date} animation="fade-up" delay={i * 80}>
                <div className="border border-vermillion/15 bg-soft-white/80 p-5 oriental-corner border-glow">
                  <p className="font-sans font-medium text-base text-charcoal">{day.date}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {day.slots.map((slot) => (
                      <span
                        key={slot}
                        className="text-[10px] uppercase tracking-button px-3 py-1.5 border border-vermillion/20 text-vermillion-dark bg-vermillion/5 hover:bg-vermillion hover:text-soft-white transition-colors cursor-pointer"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-soft-white py-14 sm:py-20 px-4 sm:px-6 text-center">
        <AnimateOnScroll animation="fade-up">
          <div className="mx-auto mb-6 h-px w-16 bg-vermillion/30" aria-hidden="true" />

          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal">
            {t("cta.title.1")}{" "}
            <span className="text-vermillion italic">{t("cta.title.2")}</span>?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-charcoal-light">
            {t("cta.desc")}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://wa.me/6589308973"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-vermillion touch-target"
            >
              {t("cta.whatsapp")}
            </a>
            <a
              href="https://instagram.com/shimmyhands.shop"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-vermillion touch-target"
            >
              {t("cta.instagram")}
            </a>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
