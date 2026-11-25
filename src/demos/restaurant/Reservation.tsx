"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { Minus, Plus, CheckCircle2 } from "lucide-react";
import type { DemoLocale } from "@/demos/shared";
import { SLOTS, MAX_GUESTS, fill, type RestaurantCopy } from "./content";

/* "Today" only exists in the browser (the page is a static export built on
   another day). Read it once through useSyncExternalStore: the server snapshot
   is null, so the HTML has placeholder chips and hydration never mismatches. */
type Now = { y: number; m: number; d: number; minutes: number };
let cached: Now | null = null;
const getNow = () => {
  if (!cached) {
    const t = new Date();
    cached = { y: t.getFullYear(), m: t.getMonth(), d: t.getDate(), minutes: t.getHours() * 60 + t.getMinutes() };
  }
  return cached;
};
const subscribe = () => () => {};

const DAYS = 7;
const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
// Fake availability: a few slots per day look taken, the same ones on every visit.
const isFull = (day: number, slot: number) => (day * 3 + slot) % 7 === 2;

type Errors = { time?: string; name?: string; phone?: string };

export default function Reservation({ c, locale }: { c: RestaurantCopy["reserve"]; locale: DemoLocale }) {
  const now = useSyncExternalStore(subscribe, getNow, () => null);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<{ date: string; time: string; guests: string; name: string } | null>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const firstSlot = useRef<HTMLButtonElement | null>(null);

  useEffect(() => { if (done) doneRef.current?.focus(); }, [done]);

  // Western digits in both locales (rule: prices/dates never use Arabic-Indic digits here).
  const intl = locale === "ar" ? "ar-JO-u-nu-latn" : "en-GB";
  // Late in the evening today has no bookable slot left, so the list starts tomorrow.
  const start = now && now.minutes + 30 >= toMin(SLOTS.dinner[SLOTS.dinner.length - 1]) ? 1 : 0;
  const dates = now ? Array.from({ length: DAYS }, (_, i) => new Date(now.y, now.m, now.d + start + i)) : [];
  const dayLabel = (i: number) =>
    i + start === 0 ? c.today : i + start === 1 ? c.tomorrow : dates[i].toLocaleDateString(intl, { weekday: "short" });

  function slotState(s: string, idx: number) {
    if (!now) return "off";
    if (day + start === 0 && toMin(s) <= now.minutes + 30) return "off";
    return isFull(dates[day].getDate(), idx) ? "full" : "open";
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const name = (f.elements.namedItem("name") as HTMLInputElement).value.trim();
    const phone = (f.elements.namedItem("phone") as HTMLInputElement).value;
    const next: Errors = {};
    if (!time) next.time = c.errors.time;
    if (!name) next.name = c.errors.name;
    if (phone.replace(/\D/g, "").length < 8) next.phone = c.errors.phone;
    setErrors(next);
    if (next.time) return firstSlot.current?.focus();
    if (next.name) return (f.elements.namedItem("name") as HTMLInputElement).focus();
    if (next.phone) return (f.elements.namedItem("phone") as HTMLInputElement).focus();
    setDone({
      date: dates[day].toLocaleDateString(intl, { weekday: "long", day: "numeric", month: "long" }),
      time: time!,
      guests: c.guestLabels[guests - 1],
      name,
    });
  }

  if (done) {
    return (
      <div className="sumac-booked" role="status">
        <CheckCircle2 size={36} strokeWidth={1.5} aria-hidden className="sumac-booked-icon" />
        <h3 ref={doneRef} tabIndex={-1}>{c.done.title}</h3>
        <p>{fill(c.done.text, { name: done.name })}</p>
        <dl className="sumac-summary">
          <div><dt>{c.summary.date}</dt><dd>{done.date}</dd></div>
          <div><dt>{c.summary.time}</dt><dd dir="ltr">{done.time}</dd></div>
          <div><dt>{c.summary.guests}</dt><dd>{done.guests}</dd></div>
          <div><dt>{c.summary.name}</dt><dd>{done.name}</dd></div>
        </dl>
        <p className="sumac-muted">{c.done.demo}</p>
        <button type="button" className="sumac-btn sumac-btn-ghost" onClick={() => { setDone(null); setTime(null); }}>
          {c.done.again}
        </button>
      </div>
    );
  }

  // Where focus goes when the form is sent without a time.
  const firstOpen = [...SLOTS.lunch, ...SLOTS.dinner].find((s, i) => slotState(s, i) === "open");
  const slotGroup = (label: string, list: string[], offset: number) => (
    <div className="sumac-slot-group">
      <p className="sumac-slot-label" aria-hidden="true">{label}</p>
      <div className="sumac-slots">
        {list.map((s, i) => {
          const st = slotState(s, i + offset);
          const isFirst = s === firstOpen;
          return (
            <button key={s} type="button" className="sumac-slot" dir="ltr" disabled={st !== "open"}
              aria-pressed={time === s} aria-label={st === "full" ? `${label} ${s}, ${c.full}` : `${label} ${s}`}
              ref={isFirst ? (el) => { firstSlot.current = el; } : undefined}
              onClick={() => { setTime(s); setErrors((er) => ({ ...er, time: undefined })); }}>
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <form className="sumac-form" noValidate onSubmit={submit}>
      <fieldset className="sumac-field">
        <legend>{c.date}</legend>
        <div className="sumac-dates">
          {now
            ? dates.map((d, i) => (
                <button key={i} type="button" className="sumac-date" aria-pressed={day === i}
                  onClick={() => { setDay(i); setTime(null); }}>
                  <span>{dayLabel(i)}</span>
                  <strong>{d.toLocaleDateString(intl, { day: "numeric", month: "short" })}</strong>
                </button>
              ))
            : Array.from({ length: DAYS }, (_, i) => <span key={i} className="sumac-date sumac-date-ph" aria-hidden="true" />)}
        </div>
      </fieldset>

      <fieldset className="sumac-field" aria-describedby={errors.time ? "sumac-err-time" : undefined}>
        <legend>{c.time}</legend>
        {slotGroup(c.lunch, SLOTS.lunch, 0)}
        {slotGroup(c.dinner, SLOTS.dinner, SLOTS.lunch.length)}
        {errors.time && <p id="sumac-err-time" className="sumac-err">{errors.time}</p>}
      </fieldset>

      <fieldset className="sumac-field">
        <legend>{c.guests}</legend>
        <div className="sumac-stepper">
          <button type="button" aria-label={c.fewer} disabled={guests <= 1} onClick={() => setGuests((g) => g - 1)}>
            <Minus size={18} aria-hidden />
          </button>
          <output aria-live="polite">{c.guestLabels[guests - 1]}</output>
          <button type="button" aria-label={c.more} disabled={guests >= MAX_GUESTS} onClick={() => setGuests((g) => g + 1)}>
            <Plus size={18} aria-hidden />
          </button>
        </div>
      </fieldset>

      <div className="sumac-inputs">
        <div>
          <label htmlFor="sumac-name">{c.name}</label>
          <input id="sumac-name" name="name" autoComplete="name" maxLength={80}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "sumac-err-name" : undefined} />
          {errors.name && <p id="sumac-err-name" className="sumac-err">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="sumac-phone">{c.phone}</label>
          <input id="sumac-phone" name="phone" type="tel" dir="ltr" inputMode="tel" autoComplete="tel" maxLength={20}
            placeholder="+962 7X XXX XXXX" aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "sumac-phone-hint sumac-err-phone" : "sumac-phone-hint"} />
          <p id="sumac-phone-hint" className="sumac-hint">{c.phoneHint}</p>
          {errors.phone && <p id="sumac-err-phone" className="sumac-err">{errors.phone}</p>}
        </div>
      </div>

      <button type="submit" className="sumac-btn sumac-btn-primary sumac-submit">{c.submit}</button>
    </form>
  );
}
