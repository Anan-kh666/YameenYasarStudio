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

    // Honeypot check — if filled, silently succeed
    if (data.get("_gotcha")) {
      setStatus("success");
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      if (res.ok) {
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
          <h2 className="text-h2 font-semibold text-ink md:text-h1">
            {t("headline")}
          </h2>
          <p className="mt-4 text-body text-ink-muted">{t("subline")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-yameen px-6 py-3 text-body font-medium text-on-yameen transition-colors hover:bg-yameen/90"
            >
              {t("whatsapp")}
            </a>
            <a
              href={`mailto:${site.email}`}
              dir="ltr"
              className="inline-flex items-center rounded-xl border-2 border-yameen px-6 py-3 text-body font-medium text-yameen transition-colors hover:bg-yameen-soft"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="bg-surface py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-h2 font-semibold text-ink md:text-h1">
          {t("headline")}
        </h2>
        <p className="mt-4 text-body text-ink-muted">{t("subline")}</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {/* Web3Forms access key */}
          <input type="hidden" name="access_key" value={WEB3FORMS_KEY} />
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {/* Name */}
          <div>
            <label htmlFor="contact-name" className="block text-small font-medium text-ink">
              {t("fieldName")}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              className="mt-1.5 block w-full rounded-xl border border-line bg-paper px-4 py-3 text-body text-ink placeholder:text-ink-muted/50 focus:border-yameen focus:outline-none focus:ring-1 focus:ring-yameen"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="contact-email" className="block text-small font-medium text-ink">
              {t("fieldEmail")}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              dir="ltr"
              className="mt-1.5 block w-full rounded-xl border border-line bg-paper px-4 py-3 text-body text-ink placeholder:text-ink-muted/50 focus:border-yameen focus:outline-none focus:ring-1 focus:ring-yameen"
            />
          </div>

          {/* Business type */}
          <div>
            <label htmlFor="contact-business" className="block text-small font-medium text-ink">
              {t("fieldBusiness")}
            </label>
            <input
              id="contact-business"
              name="business"
              type="text"
              className="mt-1.5 block w-full rounded-xl border border-line bg-paper px-4 py-3 text-body text-ink placeholder:text-ink-muted/50 focus:border-yameen focus:outline-none focus:ring-1 focus:ring-yameen"
            />
          </div>

          {/* Package select */}
          <div>
            <label htmlFor="contact-package" className="block text-small font-medium text-ink">
              {t("fieldPackage")}
            </label>
            <select
              id="contact-package"
              name="package"
              className="mt-1.5 block w-full rounded-xl border border-line bg-paper px-4 py-3 text-body text-ink focus:border-yameen focus:outline-none focus:ring-1 focus:ring-yameen"
            >
              {PACKAGE_OPTIONS.map((key) => (
                <option key={key} value={t(key)}>
                  {t(key)}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="contact-message" className="block text-small font-medium text-ink">
              {t("fieldMessage")}
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              className="mt-1.5 block w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-body text-ink placeholder:text-ink-muted/50 focus:border-yameen focus:outline-none focus:ring-1 focus:ring-yameen"
            />
          </div>

          {/* Submit + WhatsApp fallback */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center rounded-xl bg-yameen px-6 py-3 text-body font-medium text-on-yameen transition-colors hover:bg-yameen/90 disabled:opacity-60"
            >
              {t("send")}
            </button>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border-2 border-yameen px-6 py-3 text-body font-medium text-yameen transition-colors hover:bg-yameen-soft"
            >
              {t("whatsapp")}
            </a>
          </div>

          {/* Status messages */}
          {status === "success" && (
            <p className="rounded-xl bg-yameen-soft px-4 py-3 text-small text-yameen">
              {t("success")}
            </p>
          )}
          {status === "error" && (
            <p className="rounded-xl bg-yasar-soft px-4 py-3 text-small text-yasar-ink">
              {t("error")}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
