"use client";

import { useEffect, useState } from "react";
import { Captions, Check, ChevronDown, Pause, Play, RotateCcw } from "lucide-react";
import type { DemoLocale } from "@/demos/shared";
import { content } from "./content";
import { INITIALLY_DONE } from "./data";

/* Lesson player mockup + curriculum. There is no real video: "playing"
   advances a clock, and finishing a lesson ticks it in the curriculum, which
   updates the progress ring. Media controls stay left-to-right in both
   languages (like every real player), so they sit in dir="ltr". */

const SPEEDS = [1, 1.25, 1.5, 2];
// shortcut: the clock runs 10× real time so a demo lesson ends in about a minute.
const DEMO_RATE = 10;

const seconds = (mmss: string) => {
  const [m, s] = mmss.split(":").map(Number);
  return m * 60 + s;
};
const clock = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

export default function CourseDetail({ locale }: { locale: DemoLocale }) {
  const t = content[locale].course;
  const modules = t.curriculum.modules;
  const total = modules.reduce((n, m) => n + m.lessons.length, 0);

  const [done, setDone] = useState<Set<string>>(() => new Set(INITIALLY_DONE));
  const [current, setCurrent] = useState("2-0");
  const [position, setPosition] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [captions, setCaptions] = useState(true);
  const [announce, setAnnounce] = useState("");

  const [mi, li] = current.split("-").map(Number);
  const lesson = modules[mi].lessons[li];
  const length = seconds(lesson.duration);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setPosition((p) => Math.min(length, p + 0.25 * speed * DEMO_RATE)), 250);
    return () => window.clearInterval(id);
  }, [playing, speed, length]);

  // Reaching the end stops playback and marks the lesson complete.
  if (playing && position >= length) {
    setPlaying(false);
    setDone((d) => new Set(d).add(current));
    setAnnounce(t.player.finished);
  }

  function choose(key: string) {
    setCurrent(key);
    setPosition(0);
    setPlaying(true);
    setAnnounce("");
    document.getElementById("player")?.scrollIntoView({ block: "nearest" });
  }

  function toggle(key: string) {
    setDone((d) => {
      const next = new Set(d);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const pct = Math.round((done.size / total) * 100);
  const R = 26;
  const C = 2 * Math.PI * R;

  return (
    <>
      <section id="player" className="qalam-player" aria-label={t.player.region}>
        <div className="qalam-screen">
          <div className="qalam-screen-info">
            <span className="qalam-chip qalam-chip-dark">{t.player.nowPlaying}</span>
            <p className="qalam-screen-title font-heading">{lesson.title}</p>
            <p className="qalam-screen-sub">
              {t.player.module} <span dir="ltr">{mi + 1}</span> · {modules[mi].title}
            </p>
          </div>
          <button
            type="button"
            className="qalam-bigplay"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? t.player.pause : t.player.play}
          >
            {playing ? <Pause size={30} aria-hidden="true" /> : <Play size={30} aria-hidden="true" />}
          </button>
          {captions && <p className="qalam-caption">{t.player.caption}</p>}
        </div>
        <div className="qalam-controls" dir="ltr">
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? t.player.pause : t.player.play}>
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => { setPosition(0); setAnnounce(""); }} aria-label={t.player.restart}>
            <RotateCcw size={18} aria-hidden="true" />
          </button>
          <span className="qalam-num qalam-time">{clock(position)}</span>
          <input
            type="range"
            min={0}
            max={length}
            step={1}
            value={Math.floor(position)}
            onChange={(e) => setPosition(Number(e.target.value))}
            aria-label={t.player.progress}
            aria-valuetext={`${clock(position)} / ${lesson.duration}`}
            style={{ "--fill": `${(position / length) * 100}%` } as React.CSSProperties}
          />
          <span className="qalam-num qalam-time">{lesson.duration}</span>
          <button
            type="button"
            className="qalam-speed qalam-num"
            onClick={() => setSpeed((s) => SPEEDS[(SPEEDS.indexOf(s) + 1) % SPEEDS.length])}
            aria-label={`${t.player.speed}: ${speed}×`}
          >
            {speed}×
          </button>
          <button type="button" onClick={() => setCaptions((v) => !v)} aria-pressed={captions} aria-label={t.player.captions}>
            <Captions size={18} aria-hidden="true" />
          </button>
        </div>
        <p className="sr-only" aria-live="polite">{announce}</p>
      </section>

      <section id="course-content" className="qalam-block" aria-labelledby="qalam-curriculum">
        <div className="qalam-curr-head">
          <h2 id="qalam-curriculum" className="qalam-h3 font-heading">{t.curriculum.title}</h2>
          <div className="qalam-ring-wrap">
            <svg width="64" height="64" viewBox="0 0 64 64" className="qalam-ring" aria-hidden="true">
              <circle cx="32" cy="32" r={R} className="qalam-ring-track" />
              <circle
                cx="32"
                cy="32"
                r={R}
                className="qalam-ring-fill"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - done.size / total)}
                transform="rotate(-90 32 32)"
              />
              <text x="32" y="37" textAnchor="middle" className="qalam-ring-text" direction="ltr">{pct}%</text>
            </svg>
            <div>
              <p className="qalam-small qalam-muted">{t.curriculum.progress}</p>
              <p aria-live="polite" className="qalam-strong">{t.curriculum.done(done.size, total)}</p>
            </div>
          </div>
        </div>

        <div className="qalam-modules">
          {modules.map((m, i) => {
            const count = m.lessons.filter((_, j) => done.has(`${i}-${j}`)).length;
            return (
              <details key={m.title} className="qalam-module" open={i === mi}>
                <summary>
                  <span className="qalam-module-n qalam-num" dir="ltr">{String(i + 1).padStart(2, "0")}</span>
                  <span className="qalam-module-title">{m.title}</span>
                  <span className="qalam-num qalam-muted qalam-small" dir="ltr">{count}/{m.lessons.length}</span>
                  <ChevronDown size={18} aria-hidden="true" className="qalam-chev" />
                </summary>
                <ol>
                  {m.lessons.map((l, j) => {
                    const key = `${i}-${j}`;
                    const id = `qalam-l-${key}`;
                    const isCurrent = key === current;
                    return (
                      <li key={key} className={`qalam-lesson${isCurrent ? " is-current" : ""}`} aria-current={isCurrent ? "true" : undefined}>
                        <input id={id} type="checkbox" className="qalam-check" checked={done.has(key)} onChange={() => toggle(key)} />
                        <label htmlFor={id} className="qalam-lesson-title">
                          <span className="qalam-tick" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
                          {l.title}
                        </label>
                        <span className="qalam-num qalam-muted qalam-small" dir="ltr">{l.duration}</span>
                        <button type="button" className="qalam-lesson-play" onClick={() => choose(key)} aria-label={`${t.curriculum.play} ${l.title}`}>
                          <Play size={14} aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </details>
            );
          })}
        </div>
      </section>
    </>
  );
}
