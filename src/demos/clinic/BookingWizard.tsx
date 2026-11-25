"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, CalendarDays, Clock } from "lucide-react";
import { DOCTORS, SERVICE_IDS, SLOTS, type ClinicContent, type DoctorId, type ServiceId } from "./content";
import { DoctorAvatar, SERVICE_ICONS } from "./art";

type Props = { t: ClinicContent };

/* Next 7 days starting tomorrow, as local-midnight dates. Only called after a
   click (step 2), never during the server render, so there is no hydration
   mismatch between build time and visit time. */
function nextDays(): Date[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i + 1));
}

/* Deterministic "booked" slots so the grid looks lived-in but stays stable. */
function isTaken(day: Date, doctor: DoctorId, slot: string) {
  const seed = day.getDate() * 31 + doctor.length * 7 + Number(slot.replace(":", ""));
  return seed % 5 === 0 || seed % 7 === 0;
}

const PHONE_RE = /^(?:\+?966|0)?5\d{8}$/;

export default function BookingWizard({ t }: Props) {
  const b = t.booking;
  const [step, setStep] = useState(0);
  const [service, setService] = useState<ServiceId | null>(null);
  const [doctor, setDoctor] = useState<DoctorId | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Move focus to the new step's heading so keyboard and screen-reader users
  // land on the new content (skipped on first render).
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
    moved.current = true;
  }, [step, reference]);

  // Intl's `format` getters return bound functions, so they can be destructured.
  const { format: fmtDate } = new Intl.DateTimeFormat(t.intlLocale, { weekday: "long", day: "numeric", month: "long" });
  const { format: fmtWeekday } = new Intl.DateTimeFormat(t.intlLocale, { weekday: "short" });
  const { format: fmtMonth } = new Intl.DateTimeFormat(t.intlLocale, { month: "short" });
  const { format: fmtTime } = new Intl.DateTimeFormat(t.intlLocale, { hour: "numeric", minute: "2-digit", hour12: true });
  const fmtSlot = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return fmtTime(new Date(2026, 0, 1, h, m));
  };

  const nameOk = name.trim().length > 1;
  const phoneOk = PHONE_RE.test(phone.replace(/[\s-]/g, ""));
  const canNext = [service, doctor, day, slot, nameOk && phoneOk, true][step];

  function next() {
    if (step === 4 && !(nameOk && phoneOk)) {
      setTouched(true);
      return;
    }
    if (canNext) setStep(step + 1);
  }
  function reset() {
    setService(null);
    setDoctor(null);
    setDay(null);
    setSlot(null);
    setName("");
    setPhone("");
    setTouched(false);
    setReference(null);
    setStep(0);
  }
  function pickService(id: ServiceId) {
    setService(id);
    // Drop a doctor who does not offer the new treatment.
    if (doctor && !DOCTORS.find((d) => d.id === doctor)?.services.includes(id)) setDoctor(null);
  }

  const doctors = DOCTORS.filter((d) => service && d.services.includes(service));

  if (reference) {
    return (
      <div className="clinic-wizard">
        <div className="clinic-done" role="status">
          <span className="clinic-done-icon" aria-hidden="true"><Check size={28} strokeWidth={2.5} /></span>
          <h3 ref={headingRef} tabIndex={-1} className="font-heading">{b.doneTitle}</h3>
          <p>{b.doneBody}</p>
          <dl className="clinic-done-ref">
            <dt>{b.reference}</dt>
            <dd dir="ltr">{reference}</dd>
          </dl>
          <p className="clinic-done-meta">
            {service && t.services.items[service].name} · {doctor && t.doctors.items[doctor].name} · {day && fmtDate(day)} · <bdi>{slot && fmtSlot(slot)}</bdi>
          </p>
          <p className="clinic-note">{b.demoNote}</p>
          <button type="button" className="clinic-btn clinic-btn-ghost" onClick={reset}>{b.again}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="clinic-wizard">
      {/* Step indicator: a plain list in DOM order, so it runs right-to-left in Arabic by itself. */}
      <ol className="clinic-steps">
        {b.steps.map((label, i) => (
          <li key={label} className={i < step ? "is-done" : i === step ? "is-current" : undefined} aria-current={i === step ? "step" : undefined}>
            <span className="clinic-step-dot" aria-hidden="true">{i < step ? <Check size={14} strokeWidth={3} /> : i + 1}</span>
            <span className="clinic-step-label">{label}</span>
          </li>
        ))}
      </ol>

      <div className="clinic-wizard-body">
        <p className="clinic-step-of" aria-live="polite">{b.stepOf.replace("{n}", String(step + 1))}</p>
        <h3 ref={headingRef} tabIndex={-1} className="clinic-step-title font-heading">{b.headings[step]}</h3>

        {step === 0 && (
          <div className="clinic-options clinic-options-3" role="radiogroup" aria-label={b.headings[0]}>
            {SERVICE_IDS.map((id) => {
              const s = t.services.items[id];
              const Icon = SERVICE_ICONS[id];
              return (
                <button key={id} type="button" role="radio" aria-checked={service === id} className="clinic-option" onClick={() => pickService(id)}>
                  <Icon size={20} aria-hidden="true" className="clinic-option-icon" />
                  <span className="clinic-option-name">{s.name}</span>
                  <span className="clinic-option-meta">{s.price} · {s.duration}</span>
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && (
          <div className="clinic-options clinic-options-2" role="radiogroup" aria-label={b.headings[1]}>
            {doctors.map((d) => {
              const doc = t.doctors.items[d.id];
              return (
                <button key={d.id} type="button" role="radio" aria-checked={doctor === d.id} className="clinic-option clinic-option-row" onClick={() => setDoctor(d.id)}>
                  <DoctorAvatar hue={d.hue} initials={doc.initials} size={48} />
                  <span>
                    <span className="clinic-option-name">{doc.name}</span>
                    <span className="clinic-option-meta">{doc.role} · {doc.years}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <>
            <div className="clinic-days" role="radiogroup" aria-label={b.headings[2]}>
              {nextDays().map((d) => {
                const closed = d.getDay() === 5; // Friday
                return (
                  <button key={d.getTime()} type="button" role="radio" aria-checked={day?.getTime() === d.getTime()} disabled={closed}
                    aria-label={`${fmtDate(d)}${closed ? ` · ${b.closed}` : ""}`} className="clinic-day"
                    onClick={() => { setDay(d); setSlot(null); }}>
                    <span className="clinic-day-wd">{fmtWeekday(d)}</span>
                    <span className="clinic-day-num">{d.getDate()}</span>
                    <span className="clinic-day-mo">{closed ? b.closed : fmtMonth(d)}</span>
                  </button>
                );
              })}
            </div>
            <p className="clinic-hint"><CalendarDays size={16} aria-hidden="true" /> {b.closedNote}</p>
          </>
        )}

        {step === 3 && day && doctor && (
          <div className="clinic-slots">
            {([[b.morning, SLOTS.slice(0, 6)], [b.evening, SLOTS.slice(6)]] as const).map(([label, list]) => (
              <fieldset key={label}>
                <legend><Clock size={15} aria-hidden="true" /> {label}</legend>
                <div className="clinic-slot-grid" role="radiogroup" aria-label={label}>
                  {list.map((s) => {
                    const taken = isTaken(day, doctor, s);
                    return (
                      <button key={s} type="button" role="radio" aria-checked={slot === s} disabled={taken} className="clinic-slot" onClick={() => setSlot(s)}
                        aria-label={taken ? `${fmtSlot(s)} · ${b.taken}` : undefined}>
                        <bdi>{fmtSlot(s)}</bdi>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        )}

        {step === 4 && (
          <form className="clinic-form" noValidate onSubmit={(e) => { e.preventDefault(); next(); }}>
            <div className="clinic-field">
              <label htmlFor="clinic-name">{b.name}</label>
              <input id="clinic-name" autoComplete="name" maxLength={80} value={name} onChange={(e) => setName(e.target.value)}
                aria-invalid={touched && !nameOk} aria-describedby={touched && !nameOk ? "clinic-name-err" : undefined} />
              {touched && !nameOk && <p id="clinic-name-err" className="clinic-error">{b.nameError}</p>}
            </div>
            <div className="clinic-field">
              <label htmlFor="clinic-phone">{b.phone}</label>
              {/* Phone numbers are always LTR, also inside the Arabic page. */}
              <input id="clinic-phone" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" maxLength={16} placeholder="05X XXX XXXX"
                value={phone} onChange={(e) => setPhone(e.target.value)}
                aria-invalid={touched && !phoneOk} aria-describedby={touched && !phoneOk ? "clinic-phone-hint clinic-phone-err" : "clinic-phone-hint"} />
              <p id="clinic-phone-hint" className="clinic-hint">{b.phoneHint}</p>
              {touched && !phoneOk && <p id="clinic-phone-err" className="clinic-error">{b.phoneError}</p>}
            </div>
            {/* Lets Enter in a field submit the step. */}
            <button type="submit" hidden tabIndex={-1} />
          </form>
        )}

        {step === 5 && service && doctor && day && slot && (
          <dl className="clinic-summary">
            {([
              [b.summary.service, t.services.items[service].name, 0],
              [b.summary.doctor, t.doctors.items[doctor].name, 1],
              [b.summary.date, fmtDate(day), 2],
              [b.summary.time, fmtSlot(slot), 3],
              [b.summary.patient, name.trim(), 4],
              [b.summary.phone, phone.trim(), 4],
              [b.summary.price, t.services.items[service].price, 0],
            ] as const).map(([label, value, target]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>
                  {label === b.summary.phone ? <span dir="ltr">{value}</span> : <bdi>{value}</bdi>}
                </dd>
                <button type="button" className="clinic-link" onClick={() => setStep(target)} aria-label={`${b.edit}: ${label}`}>
                  {b.edit}
                </button>
              </div>
            ))}
          </dl>
        )}

        <div className="clinic-wizard-nav">
          {step > 0 ? (
            <button type="button" className="clinic-btn clinic-btn-ghost" onClick={() => setStep(step - 1)}>
              <ChevronLeft size={18} aria-hidden="true" className="rtl:-scale-x-100" /> {b.back}
            </button>
          ) : <span />}
          {step < 5 ? (
            <button type="button" className="clinic-btn clinic-btn-primary" onClick={next} aria-disabled={!canNext && step !== 4}>
              {b.next} <ChevronRight size={18} aria-hidden="true" className="rtl:-scale-x-100" />
            </button>
          ) : (
            <button type="button" className="clinic-btn clinic-btn-primary"
              onClick={() => setReference(`BSM-${Math.floor(10000 + Math.random() * 90000)}`)}>
              <Check size={18} aria-hidden="true" /> {b.confirm}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
