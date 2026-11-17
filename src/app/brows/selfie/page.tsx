"use client";

import { useEffect } from "react";
import BrowSelfieCamera from "@/components/BrowSelfieCamera";

export default function BrowSelfiePage() {
  // Full-screen tool: hide the site navbar and footer.
  useEffect(() => {
    document.body.classList.add("links-page");
    return () => document.body.classList.remove("links-page");
  }, []);

  return <BrowSelfieCamera />;
}
