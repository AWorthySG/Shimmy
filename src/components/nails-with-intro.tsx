"use client";

import type { ReactNode } from "react";
import { NailIntro } from "./nail-intro";
import { IntroGate } from "./intro-gate";

/** Nails page: the nail painting intro, once per session. */
export function NailsWithIntro({ children }: { children: ReactNode }) {
  return (
    <IntroGate storageKey="shimmy-intro-nails" intro={(done) => <NailIntro onComplete={done} />}>
      {children}
    </IntroGate>
  );
}
