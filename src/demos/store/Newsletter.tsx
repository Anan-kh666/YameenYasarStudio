"use client";

import { useState } from "react";
import type { StoreCopy } from "./content";

/* Fake sign-up: validates the address and shows a thank-you. No request is
   sent (demo site, and the CSP only allows the studio's own form endpoint). */
export default function Newsletter({ c }: { c: StoreCopy["newsletter"] }) {
  const [state, setState] = useState<"idle" | "invalid" | "done">("idle");

  if (state === "done") return <p className="lamsa-news-done" role="status">{c.success}</p>;

  return (
    <form className="lamsa-news-form" noValidate onSubmit={(e) => {
      e.preventDefault();
      const input = e.currentTarget.elements.namedItem("email") as HTMLInputElement;
      setState(input.checkValidity() && input.value ? "done" : "invalid");
    }}>
      <label htmlFor="lamsa-email" className="lamsa-sr">{c.label}</label>
      <input id="lamsa-email" name="email" type="email" dir="ltr" autoComplete="email" required maxLength={120}
        placeholder="name@example.com" aria-invalid={state === "invalid"} aria-describedby="lamsa-email-msg" />
      <button type="submit" className="lamsa-btn lamsa-btn-primary">{c.button}</button>
      <p id="lamsa-email-msg" className="lamsa-warn" aria-live="polite">{state === "invalid" ? c.invalid : ""}</p>
    </form>
  );
}
