"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CircleAlert, CircleCheck, ChevronDown, Mail } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const PACKAGE_OPTIONS = ["packageLaunch", "packageBusiness", "packageCustom", "packageNotSure"] as const;

export default function Contact() {
  const t = useTranslations("contact");
  const tWa = useTranslations("whatsapp");

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot ticked → a bot. Pretend it worked and send nothing.
    if (data.get("botcheck")) {
      setStatus("success");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
        // Give up after 20s so a hung request shows the error message
        // (with the WhatsApp/email fallback) instead of "sending" forever.
        // AbortSignal.timeout is missing on older Safari, so only use it if present.
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(20_000) : undefined,
      });
      // Web3Forms can answer 200 with { success: false } (e.g. a rejected
      // key), so check the body too, not just the HTTP status.
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success !== false) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const waHref = whatsappUrl(tWa("prefilled"));

  /* The direct ways to reach us: shown beside the form, or on their own
     when there is no Web3Forms key at build time. */
  const direct = (
    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-cta inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-crimson px-6 py-3 text-body font-medium text-text transition-[background-color,box-shadow] hover:bg-crimson/90 sm:flex-1 lg:flex-none"
      >
        <WhatsAppIcon className="size-5" />
        {t("whatsapp")}
      </a>
      <a
        href={`mailto:${site.email}`}
        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl border border-line bg-bg/40 px-6 py-3 text-body text-text transition-colors hover:border-crimson-bright hover:text-crimson-bright sm:flex-1 lg:flex-none"
      >
        <Mail size={18} aria-hidden="true" />
        {/* Email stays left-to-right inside Arabic text */}
        <span dir="ltr">{site.email}</span>
      </a>
    </div>
  );

  /* If no Web3Forms key, show WhatsApp/email only instead of the form */
  if (!WEB3FORMS_KEY) {
    return (
      <section id="contact" className="section-glow bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeading>{t("headline")}</SectionHeading>
          <p className="mt-6 text-body text-text-muted">{t("subline")}</p>
          <div className="mt-8 max-w-md">{direct}</div>
        </div>
      </section>
    );
  }

  // Inputs, select and textarea share one look: 48px+ tall, hairline border
  const fieldClass = "mt-2 block min-h-12 w-full rounded-xl border border-line bg-surface px-4 py-3 text-body text-text placeholder:text-text-muted/50 transition-colors hover:border-text-muted/40 focus:border-crimson-bright";
  const labelClass = "block text-small font-medium text-text/90";

  return (
    <section id="contact" className="section-glow bg-surface py-20 md:py-28" style={{ "--glow-x": "10%", "--glow-y": "100%" } as React.CSSProperties}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
        {/* On wide screens this column stretches to the form's height:
            heading at the top, the direct buttons resting at the bottom,
            level with the Send button, so there is no empty block. */}
        <div className="flex flex-col gap-8 lg:col-span-5 lg:justify-between">
          <div>
            <SectionHeading>{t("headline")}</SectionHeading>
            <p className="mt-6 max-w-sm text-body text-text-muted">{t("subline")}</p>
          </div>
          <div className="lg:max-w-xs lg:border-t lg:border-line lg:pt-8">{direct}</div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-[linear-gradient(to_bottom,rgba(255,255,255,0.025),transparent_8rem)] bg-bg p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-8 lg:col-span-7"
        >
          <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
          {/* Honeypot, hidden from real users. "botcheck" is the name
              Web3Forms checks on its server, so it also stops bots that
              post to the API directly instead of using this form. */}
          <input
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className={labelClass}>{t("fieldName")}</label>
              <input id="contact-name" name="name" type="text" required maxLength={100} autoComplete="name" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>{t("fieldEmail")}</label>
              <input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" dir="ltr" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="contact-business" className={labelClass}>{t("fieldBusiness")}</label>
              <input id="contact-business" name="business" type="text" maxLength={200} autoComplete="organization" className={fieldClass} />
            </div>
            <div>
              <label htmlFor="contact-package" className={labelClass}>{t("fieldPackage")}</label>
              {/* Native arrow removed (it sits on the wrong edge in RTL and
                  looks different per browser); the chevron uses end-4, so it
                  is on the left in Arabic and the right in English. */}
              <div className="relative">
                <select id="contact-package" name="package" className={`${fieldClass} appearance-none pe-11`}>
                  {PACKAGE_OPTIONS.map((key) => (
                    <option key={key} value={t(key)}>
                      {t(key)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute end-4 top-1/2 mt-1 -translate-y-1/2 text-text-muted"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contact-message" className={labelClass}>{t("fieldMessage")}</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                maxLength={5000}
                className={`${fieldClass} resize-y`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-crimson px-6 py-3 text-body font-medium text-text transition-colors hover:bg-crimson/90 disabled:cursor-wait disabled:opacity-60"
          >
            {t("send")}
          </button>

          {/* Always-present live region: screen readers announce text that
              appears inside it (a region inserted together with its text is
              often missed). */}
          <div aria-live="polite" aria-atomic="true">
            {status === "success" && (
              <p className="mt-4 flex items-start gap-3 rounded-xl border border-text/20 bg-text/[0.04] px-4 py-3 text-small text-text">
                <CircleCheck size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-text" />
                {t("success")}
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 flex items-start gap-3 rounded-xl border border-crimson-bright/40 bg-crimson/15 px-4 py-3 text-small text-text">
                <CircleAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-crimson-bright" />
                {t("error")}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
