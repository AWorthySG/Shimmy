import Image from "next/image";
import type { ReactNode } from "react";
import LazyVideo from "@/components/LazyVideo";

type Clip = { src: string; poster: string; alt: string };

type Props = {
  /** One clip fills the screen. Several clips sit side by side from the md breakpoint; phones show the first. */
  clips: Clip[];
  eyebrow: string;
  title: ReactNode;
  desc: string;
  actions: ReactNode;
  /** Content under the hero copy, inside the dark band (e.g. stats). */
  footer?: ReactNode;
};

/**
 * Full-screen video hero. The poster is a priority image, so it is what loads
 * and paints first; the clip starts after the page has loaded and stays on its
 * poster for reduced-motion and data-saver visitors (see LazyVideo).
 */
export default function CinematicHero({ clips, eyebrow, title, desc, actions, footer }: Props) {
  const multi = clips.length > 1;

  return (
    <section className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden bg-scrim text-on-scrim">
      <div className={`absolute inset-0 -z-10 grid hero-zoom ${multi ? "md:grid-cols-3" : ""}`}>
        {clips.map((clip, i) => (
          <div key={clip.src} className={`relative h-full overflow-hidden ${i > 0 ? "hidden md:block" : ""}`}>
            <Image
              src={clip.poster}
              alt={clip.alt}
              fill
              priority={i === 0}
              sizes={multi ? "(max-width: 768px) 100vw, 34vw" : "100vw"}
              className="object-cover"
            />
            <LazyVideo src={clip.src} poster={clip.poster} eager className="absolute inset-0 h-full w-full object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-scrim via-scrim/45 to-scrim/15" aria-hidden="true" />

      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-32 sm:px-6 sm:pb-16 md:pb-20">
        <p className="eyebrow animate-fade-in-up text-on-scrim/80">{eyebrow}</p>
        <h1 className="animate-fade-in-up animate-delay-100 mt-4 max-w-3xl font-serif text-5xl leading-[1.05] text-on-scrim sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="animate-fade-in-up animate-delay-200 mt-5 max-w-xl text-base leading-relaxed text-on-scrim/85 md:text-lg">
          {desc}
        </p>
        <div className="animate-fade-in-up animate-delay-300 mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div>
        {footer && <div className="mt-12 sm:mt-16">{footer}</div>}
      </div>
    </section>
  );
}
