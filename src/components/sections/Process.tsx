import { useTranslations } from "next-intl";
import { Code2, MessageCircle, PenTool, Rocket, Wallet } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

const STEPS = [
  { n: 1, Icon: MessageCircle },
  { n: 2, Icon: PenTool },
  { n: 3, Icon: Code2 },
  { n: 4, Icon: Rocket },
] as const;

/* The four steps as a product timeline: a thin gradient line with a dot per
   step, a panel under each dot. The line runs in reading order: across from
   lg (left → right in LTR, right → left in RTL, because the grid and the
   gradient follow `dir`), down the start edge on phones. */
export default function Process() {
  const t = useTranslations("process");
  // "Payment: …" is one message; the label before the first colon is shown
  // bold. The wording stays exactly as written in both locales.
  const payment = t("payment");
  const colon = payment.indexOf(":");
  const paymentLabel = colon > 0 ? payment.slice(0, colon) : "";
  const paymentBody = colon > 0 ? payment.slice(colon + 1).trim() : payment;

  return (
    <section id="process" className="relative isolate py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionMarker label={t("marker")} className="mb-6" />
        <SectionHeading className="max-w-3xl">{t("headline")}</SectionHeading>

        <ol className="pp-timeline mt-14 grid gap-5 md:mt-20 lg:grid-cols-4 lg:gap-6">
          {STEPS.map(({ n, Icon }) => (
            <li key={n} className="pp-step relative ps-9 lg:ps-0 lg:pt-10">
              <span className="pp-dot" aria-hidden="true" />
              <div className="panel h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="icon-tile" aria-hidden="true">
                    <Icon size={20} />
                  </span>
                  {/* Step number: Western digits in both locales */}
                  <span dir="ltr" className="pp-num" aria-hidden="true">
                    {String(n).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 font-heading text-[1.375rem] font-semibold leading-[1.25] text-text rtl:leading-[1.35]">
                  {t(`step${n}Title`)}
                </h3>
                <p className="mt-2 text-small text-text-muted">{t(`step${n}Body`)}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Payment terms as a quiet info panel */}
        <div className="panel panel-bg mt-8 flex items-start gap-4 p-5 md:items-center md:p-6">
          <span className="icon-tile" aria-hidden="true">
            <Wallet size={20} />
          </span>
          <p className="text-body text-text-muted">
            {paymentLabel && <strong className="font-medium text-text">{paymentLabel}: </strong>}
            {paymentBody}
          </p>
        </div>
      </div>
    </section>
  );
}
