"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Mail } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const PACKAGE_OPTIONS = ["packageLaunch", "packageBusiness", "packageCustom", "packageNotSure"] as const;

export default function Contact() {
  const t = useTranslations("contact");
  const tWa = useTranslations("whatsapp");
  const locale = useLocale();

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

  const waHref = whatsappUrl(locale, tWa("prefilled"));

  /* The direct ways to reach us: shown beside the form, or on their own
     when there is no Web3Forms key at build time. */
  const direct = (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-cta inline-flex items-center justify-center gap-2 rounded-xl bg-crimson px-6 py-3 lg:min-w-72 text-body font-medium text-text transition-[background-color,box-shadow] hover:bg-crimson/90"
      >
        <WhatsAppIcon className="size-5" />
        {t("whatsapp")}
      </a>
      <a
        href={`mailto:${site.email}`}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-6 py-3 lg:min-w-72 text-body text-text transition-colors hover:border-crimson-bright hover:text-crimson-bright"
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
          {direct}
        </div>
      </section>
    );
  }

  const fieldClass = "mt-2 block w-full rounded-xl border border-line bg-surface px-4 py-3 text-body text-text placeholder:text-text-muted/50 transition-colors focus:border-crimson-bright focus:outline-none focus:ring-1 focus:ring-crimson-bright";
  const labelClass = "block text-small font-medium text-text";

  return (
    <section id="contact" className="section-glow bg-surface py-20 md:py-28" style={{ "--glow-x": "10%", "--glow-y": "100%" } as React.CSSProperties}>
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div>
          <SectionHeading>{t("headline")}</SectionHeading>
          <p className="mt-6 text-body text-text-muted">{t("subline")}</p>
          {direct}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-line bg-bg p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-8"
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
              <select id="contact-package" name="package" className={fieldClass}>
                {PACKAGE_OPTIONS.map((key) => (
                  <option key={key} value={t(key)}>
                    {t(key)}
                  </option>
                ))}
              </select>
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
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-crimson px-6 py-3.5 text-body font-medium text-text transition-colors hover:bg-crimson/90 disabled:opacity-60"
          >
            {t("send")}
          </button>

          {status === "success" && (
            <p role="status" className="mt-4 rounded-xl border border-crimson-bright/30 bg-crimson/15 px-4 py-3 text-small text-text">
              {t("success")}
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="mt-4 rounded-xl border border-crimson-bright/30 bg-crimson/15 px-4 py-3 text-small text-text">
              {t("error")}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
