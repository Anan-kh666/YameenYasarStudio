import { useTranslations } from "next-intl";
import { Globe, ShoppingBag, CalendarCheck, LayoutDashboard, AppWindow, Bot, ArrowLeftRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionMarker from "@/components/ui/SectionMarker";

/* Must match services.items.* in messages/*.json. `mock` = the two wide
   bento cards (from lg) that carry a small decorative UI. */
const SERVICES = [
  { key: "websites", Icon: Globe, mock: "site" },
  { key: "stores", Icon: ShoppingBag },
  { key: "booking", Icon: CalendarCheck },
  { key: "dashboards", Icon: LayoutDashboard },
  { key: "webapps", Icon: AppWindow, mock: "app" },
  { key: "ai", Icon: Bot },
] as const;

/* Bar heights for the app mock: shapes only, no data. */
const BARS = [38, 62, 46, 80, 54, 92, 68];

/* A bilingual page in a browser window: the same skeleton laid out once
   LTR and once RTL. Lines are block boxes narrower than their pane, so each
   hugs its pane's start edge: left in the LTR half, right in the RTL half. */
function SiteMock() {
  return (
    <div className="svc-mock" aria-hidden="true">
      <div className="window-bar">
        <span className="svc-url" />
      </div>
      {/* dir="ltr" pins the pane order (LTR left, RTL right) in both locales */}
      <div dir="ltr" className="svc-panes">
        {(["ltr", "rtl"] as const).map((dir) => (
          <div key={dir} dir={dir} className="svc-pane">
            <span className="svc-line svc-line-head w-[72%]" />
            <span className="svc-line w-[92%]" />
            <span className="svc-line w-[64%]" />
            <span className="svc-pill" />
          </div>
        ))}
        <span className="svc-swap">
          <ArrowLeftRight size={14} strokeWidth={1.8} />
        </span>
      </div>
    </div>
  );
}

/* A small app screen: sidebar, three stat tiles, a bar chart. */
function AppMock() {
  return (
    <div className="svc-mock svc-app" aria-hidden="true">
      <div className="svc-side">
        <span className="svc-nav svc-nav-on" />
        <span className="svc-nav" />
        <span className="svc-nav" />
        <span className="svc-nav" />
      </div>
      <div className="svc-main">
        <div className="svc-stats">
          {[0, 1, 2].map((i) => (
            <span key={i} className="svc-stat">
              <span className="svc-line w-1/2" />
              <span className="svc-line svc-line-head w-3/4" />
            </span>
          ))}
        </div>
        <div className="svc-chart">
          {BARS.map((h, i) => (
            <span key={i} className={i === 5 ? "svc-bar svc-bar-on" : "svc-bar"} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const t = useTranslations("services");

  return (
    <section id="services" className="section-pad relative overflow-hidden bg-bg">
      <div className="aurora absolute inset-x-0 top-0 h-[28rem] opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionMarker label={t("marker")} className="mb-6" />
        <SectionHeading lead={t("lead")}>{t("headline")}</SectionHeading>

        {/* Bento: 1 column on phones, 2 at md, 4 at lg where the two mock
            cards span 2 (row 1: wide + 2, row 2: 1 + wide + 1). */}
        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {SERVICES.map((s) => {
            const mock = "mock" in s ? s.mock : null;
            return (
              <li
                key={s.key}
                className={`panel flex flex-col gap-8 p-6 md:p-7 ${mock ? "lg:col-span-2" : "bg-dots justify-between"}`}
              >
                <span className="icon-tile">
                  <s.Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                </span>
                {mock === "site" && <SiteMock />}
                {mock === "app" && <AppMock />}
                <div>
                  <h3 className="font-heading text-[1.25rem] font-semibold leading-[1.3] text-text ltr:tracking-[-0.01em] rtl:leading-[1.4]">
                    {t(`items.${s.key}.title`)}
                  </h3>
                  <p className="mt-2 text-small text-text-muted md:text-[0.9375rem] md:leading-6">
                    {t(`items.${s.key}.body`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
