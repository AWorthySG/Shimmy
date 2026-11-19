"use client";

import type { ReactNode } from "react";
import { BrowIntro } from "./brow-intro";
import { IntroGate } from "./intro-gate";

/** Brows page: the brow embroidery intro, once per session. */
export function HomeWithIntro({ children }: { children: ReactNode }) {
  return (
    <IntroGate storageKey="shimmy-intro-brows" intro={(done) => <BrowIntro onComplete={done} />}>
      {children}
    </IntroGate>
  );
}
