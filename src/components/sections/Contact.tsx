"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { site, whatsappUrl } from "@/lib/site";

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

  /* If no Web3Forms key, show WhatsApp/email fallback instead of form */
  if (!WEB3FORMS_KEY) {
    return (
      <section id="contact" className="bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="font-heading text-h2 font-semibold text-text md:text-h1">
            {t("headline")}
          </h2>
          <p className="mt-4 text-body text-text-muted">{t("subline")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-crimson px-6 py-3 text-body font-medium text-text transition-colors hover:bg-crimson/90"
            >
              {t("whatsapp")}
            </a>
            <a
              href={`mailto:${site.email}`}
              dir="ltr"
              className="inline-flex items-center rounded-xl border-2 border-crimson-bright px-6 py-3 text-body font-medium text-crimson-bright transition-colors hover:bg-surface"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>
    );
  }

  const inputClass = "mt-1.5 block w-full rounded-xl border border-line bg-bg px-4 py-3 text-body text-text placeholder:text-text-muted/50 focus:border-crimson-bright focus:outline-none focus:ring-1 focus:ring-crimson-bright";

  return (
    <section id="contact" className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-heading text-h2 font-semibold text-text md:text-h1">
          {t("headline")}
        </h2>
        <p className="mt-4 text-body text-text-muted">{t("subline")}</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
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

          <div>
            <label htmlFor="contact-name" className="block text-small font-medium text-text">
              {t("fieldName")}
            </label>
            <input id="contact-name" name="name" type="text" required maxLength={100} autoComplete="name" className={inputClass} />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-small font-medium text-text">
              {t("fieldEmail")}
            </label>
            <input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" dir="ltr" className={inputClass} />
          </div>

          <div>
            <label htmlFor="contact-business" className="block text-small font-medium text-text">
              {t("fieldBusiness")}
            </label>
            <input id="contact-business" name="business" type="text" maxLength={200} autoComplete="organization" className={inputClass} />
          </div>

          <div>
            <label htmlFor="contact-package" className="block text-small font-medium text-text">
              {t("fieldPackage")}
            </label>
            <select
              id="contact-package"
              name="package"
              className="mt-1.5 block w-full rounded-xl border border-line bg-bg px-4 py-3 text-body text-text focus:border-crimson-bright focus:outline-none focus:ring-1 focus:ring-crimson-bright"
            >
              {PACKAGE_OPTIONS.map((key) => (
                <option key={key} value={t(key)}>
                  {t(key)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-small font-medium text-text">
              {t("fieldMessage")}
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              maxLength={5000}
              className="mt-1.5 block w-full resize-y rounded-xl border border-line bg-bg px-4 py-3 text-body text-text placeholder:text-text-muted/50 focus:border-crimson-bright focus:outline-none focus:ring-1 focus:ring-crimson-bright"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center rounded-xl bg-crimson px-6 py-3 text-body font-medium text-text transition-colors hover:bg-crimson/90 disabled:opacity-60"
            >
              {t("send")}
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border-2 border-crimson-bright px-6 py-3 text-body font-medium text-crimson-bright transition-colors hover:bg-surface"
            >
              {t("whatsapp")}
            </a>
          </div>

          {status === "success" && (
            <p className="rounded-xl bg-surface px-4 py-3 text-small text-crimson-bright">
              {t("success")}
            </p>
          )}
          {status === "error" && (
            <p className="rounded-xl bg-surface px-4 py-3 text-small text-crimson-bright">
              {t("error")}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
