"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CircleAlert, CircleCheck, ChevronDown, Mail } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";
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

  /* The direct ways to reach us, as app-style rows: shown beside the form,
     or on their own when there is no Web3Forms key at build time.
     Number and email stay left-to-right inside Arabic text. */
  const channels = [
    { href: waHref, external: true, icon: <WhatsAppIcon className="size-5" />, label: t("whatsapp"), value: `+${site.whatsappNumber}` },
    { href: `mailto:${site.email}`, external: false, icon: <Mail size={20} aria-hidden="true" />, label: t("fieldEmail"), value: site.email },
  ];
  const direct = (
    <ul className="flex flex-col gap-3">
      {channels.map(({ href, external, icon, label, value }) => (
        <li key={href}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="panel panel-bg lift ct-channel flex min-h-16 items-center gap-4 p-4"
          >
            <span className="icon-tile">{icon}</span>
            <span className="flex min-w-0 flex-col">
              <span className="text-body font-medium text-text">{label}</span>
              <span dir="ltr" className="truncate text-small text-text-muted">{value}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );

  const intro = (
    <>
      <SectionMarker label={t("marker")} className="mb-6" />
      <SectionHeading>{t("headline")}</SectionHeading>
      <p className="mt-6 max-w-sm text-body text-text-muted">{t("subline")}</p>
    </>
  );

  /* If no Web3Forms key, show WhatsApp/email only instead of the form */
  if (!WEB3FORMS_KEY) {
    return (
      <section id="contact" className="bg-surface py-20 text-text md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {intro}
          <div className="mt-8 max-w-md">{direct}</div>
        </div>
      </section>
    );
  }

  // Inputs, select and textarea share one look: 48px+ tall, hairline border,
  // crimson ring on focus (on top of the global 2px focus-visible outline)
  const fieldClass = "ct-field mt-2 block min-h-12 w-full rounded-xl border border-line bg-bg px-4 py-3 text-body text-text placeholder:text-text-muted/50 transition-[border-color,box-shadow] hover:border-text-muted/40 focus:border-crimson-bright";
  const labelClass = "block text-small font-medium text-text/85";

  return (
    <section id="contact" className="relative isolate overflow-hidden bg-surface py-20 text-text md:py-28">
      <div className="aurora absolute -bottom-40 start-0 -z-10 h-[30rem] w-[40rem] max-w-full opacity-60" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
        {/* Heading, subline and the direct channels stay in view beside the
            taller form on wide screens. */}
        <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
          {intro}
          <div className="mt-8 lg:max-w-sm">{direct}</div>
        </div>

        {/* The form as an app panel with a window bar. The bar is decorative
            (the section heading already names the form) and holds no <p>:
            test:site reads the status message as the form's last <p>. */}
        <form onSubmit={handleSubmit} className="panel window lg:col-span-7">
          <div className="window-bar" aria-hidden="true">
            <span className="text-small font-medium text-text-muted">{t("formTitle")}</span>
          </div>
          <div className="p-5 sm:p-8">
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
              className="btn btn-primary mt-7 w-full text-body disabled:cursor-wait disabled:opacity-60"
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
          </div>
        </form>
      </div>
    </section>
  );
}
