// End-to-end checks of the built site (run `npm run build` first):
//   npm run test:site
//
// Serves out/ the way Cloudflare does (applies out/_headers, trailing-slash
// redirects, 404.html) and drives Chrome through both locales, the intro,
// the contact form (Web3Forms is mocked, nothing is sent), navigation and
// the security headers / Content-Security-Policy.
//
// Uses the installed Google Chrome; set CHROME_PATH to use another one.

import puppeteer from "puppeteer-core";
import http from "node:http";
import { readFileSync, existsSync, statSync, createReadStream } from "node:fs";
import path from "node:path";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = path.resolve("out");
const PORT = 4173;

/* Minimal stand-in for Cloudflare static hosting */
function createServer(ROOT) {
  const rules = []; let cur = null;
  for (const line of readFileSync(path.join(ROOT, "_headers"), "utf8").split("\n")) {
    if (!line.trim() || line.startsWith("#")) continue;
    if (!line.startsWith(" ")) { cur = { pat: line.trim(), h: [] }; rules.push(cur); }
    else { const i = line.indexOf(":"); cur.h.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]); }
  }
  const match = (pat, p) => pat.endsWith("*") ? p.startsWith(pat.slice(0, -1)) : pat === p;
  const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".ico": "image/x-icon", ".svg": "image/svg+xml" };
  return http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    let file = path.join(ROOT, url);
    if (!file.startsWith(ROOT)) { res.writeHead(400); return res.end(); }
    let status = 200;
    if (existsSync(file) && statSync(file).isDirectory()) {
      if (!url.endsWith("/")) { res.writeHead(308, { Location: url + "/" }); return res.end(); }
      file = path.join(file, "index.html");
    }
    if (!existsSync(file)) { status = 404; file = path.join(ROOT, "404.html"); }
    const headers = { "Content-Type": types[path.extname(file)] || "application/octet-stream" };
    for (const r of rules) if (match(r.pat, status === 404 ? "/__404" : url)) for (const [k, v] of r.h) headers[k] = headers[k] ? headers[k] + ", " + v : v;
    if (status === 404) for (const r of rules) if (r.pat === "/*") for (const [k, v] of r.h) headers[k] = v;
    res.writeHead(status, headers); createReadStream(file).pipe(res);
  });
}

const BASE = `http://localhost:${PORT}`;
const results = []; const ok = (name, pass, info = "") => { results.push([pass ? "PASS" : "FAIL", name, info]); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function newPage(b, { w = 1280, h = 800, lang = "en-US", reduced = false, storage = null } = {}) {
  const ctx = await b.createBrowserContext(); // fresh profile: no shared localStorage
  const p = await ctx.newPage();
  await p.setViewport({ width: w, height: h, isMobile: w < 500, hasTouch: w < 500 });
  await p.setExtraHTTPHeaders({ "Accept-Language": lang });
  await p.evaluateOnNewDocument((lang) => { Object.defineProperty(navigator, "language", { get: () => lang }); }, lang);
  if (reduced) await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  if (storage) await p.evaluateOnNewDocument((s) => { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); }, storage);
  p._v = []; p._err = [];
  await p.evaluateOnNewDocument(() => { window.__csp = []; document.addEventListener("securitypolicyviolation", e => window.__csp.push(e.violatedDirective + " " + (e.blockedURI || "inline"))); });
  p.on("pageerror", e => p._err.push(e.message));
  p.on("console", m => { if (m.type() === "error") p._err.push("console: " + m.text()); });
  return p;
}

(async () => {
  const server = createServer(OUT).listen(PORT);
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new" });

  // ── 1. Locale pages: headers, CSP clean, structure, a11y basics, both widths
  for (const loc of ["ar", "en"]) for (const w of [375, 1280]) {
    const p = await newPage(b, { w, h: w < 500 ? 812 : 800 });
    const resp = await p.goto(`${BASE}/${loc}/`, { waitUntil: "networkidle0" });
    const H = resp.headers();
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); } scrollTo(0, 0); });
    await sleep(500);
    const r = await p.evaluate(() => ({
      csp: window.__csp, lang: document.documentElement.lang, dir: document.documentElement.dir,
      hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      imgsNoAlt: [...document.images].filter(i => !i.hasAttribute("alt")).map(i => i.src),
      blankNoRel: [...document.querySelectorAll('a[target="_blank"]')].filter(a => !/noopener/.test(a.rel) || !/noreferrer/.test(a.rel)).map(a => a.href),
      httpLinks: [...document.querySelectorAll("a[href^='http:'], img[src^='http:'], script[src^='http:']")].length,
      headingFont: getComputedStyle(document.querySelector("h2")).fontFamily,
      ids: ["hero","problem","packages","work","process","about","faq","contact"].filter(id => !document.getElementById(id)),
      form: !!document.querySelector("#contact form"), botcheck: !!document.querySelector('input[name="botcheck"]'),
      ldjson: (() => { try { return JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)["@type"]; } catch (e) { return "BAD " + e.message; } })(),
      external: [...document.querySelectorAll("script[src], link[rel~=stylesheet], link[rel~=preload], link[rel~=modulepreload], link[rel~=icon], img, video, source")].map(e => e.src || e.href || e.currentSrc).filter(u => u && !u.startsWith(location.origin)),
    }));
    const tag = `${loc} @${w}px`;
    ok(`${tag}: security headers present`, ["content-security-policy","x-content-type-options","referrer-policy","x-frame-options","permissions-policy","strict-transport-security","cross-origin-opener-policy"].every(k => H[k]), Object.keys(H).filter(k=>/policy|x-|transport/.test(k)).join(","));
    ok(`${tag}: no CSP violations`, r.csp.length === 0, r.csp.join(" | "));
    ok(`${tag}: no JS errors`, p._err.length === 0, p._err.join(" | "));
    ok(`${tag}: lang/dir correct`, r.lang === loc && r.dir === (loc === "ar" ? "rtl" : "ltr"), r.lang + "/" + r.dir);
    ok(`${tag}: no horizontal scroll`, !r.hscroll);
    ok(`${tag}: all images have alt`, r.imgsNoAlt.length === 0, r.imgsNoAlt.join(","));
    ok(`${tag}: target=_blank links have noopener noreferrer`, r.blankNoRel.length === 0, r.blankNoRel.join(","));
    ok(`${tag}: no insecure http: resources`, r.httpLinks === 0);
    ok(`${tag}: no third-party scripts/styles loaded`, r.external.length === 0, r.external.join(","));
    ok(`${tag}: all section anchors exist`, r.ids.length === 0, r.ids.join(","));
    ok(`${tag}: heading font`, loc === "ar" ? /tajawal/i.test(r.headingFont) : /cormorant/i.test(r.headingFont), r.headingFont.slice(0, 50));
    ok(`${tag}: contact form + botcheck honeypot`, r.form && r.botcheck);
    ok(`${tag}: JSON-LD parses`, r.ldjson === "ProfessionalService", r.ldjson);
    await p.close();
  }

  // ── 2. CSP actually blocks an injected inline script
  {
    const p = await newPage(b);
    await p.goto(`${BASE}/en/`, { waitUntil: "networkidle0" });
    const ran = await p.evaluate(async () => { window.__pwn = false; const s = document.createElement("script"); s.textContent = "window.__pwn = true"; document.body.appendChild(s); await new Promise(r => setTimeout(r, 200)); return { pwn: window.__pwn, v: window.__csp }; });
    ok("CSP blocks injected inline script", ran.pwn === false && ran.v.some(v => v.startsWith("script-src")), JSON.stringify(ran.v));
    const cspHeader = (await (await fetch(BASE + "/en/")).headers.get("content-security-policy")) || "";
    ok("CSP has no unsafe-eval / unsafe-inline for scripts", !/unsafe-eval/.test(cspHeader) && !/script-src[^;]*unsafe-inline/.test(cspHeader));
    const ext = await p.evaluate(async () => { try { await fetch("https://example.com/"); return "allowed"; } catch { return "blocked"; } });
    ok("CSP blocks fetch to unknown origin", ext === "blocked", ext);
    await p.close();
  }

  // ── 3. Contact form (Web3Forms mocked — nothing is really sent)
  for (const scenario of ["success", "fail-200", "http-500", "honeypot"]) {
    const p = await newPage(b);
    await p.setRequestInterception(true);
    let posted = null;
    p.on("request", req => {
      if (req.url().startsWith("https://api.web3forms.com")) {
        if (req.method() === "OPTIONS") return req.respond({ status: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "*" } });
        posted = req.postData() || "";
        const body = scenario === "success" ? { success: true } : { success: false, message: "x" };
        return req.respond({ status: scenario === "http-500" ? 500 : 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify(body) });
      }
      req.continue();
    });
    await p.goto(`${BASE}/en/#contact`, { waitUntil: "networkidle0" });
    await p.type("#contact-name", "Test Person");
    await p.type("#contact-email", "test@example.com");
    await p.type("#contact-message", "Hello <script>alert(1)</script>");
    if (scenario === "honeypot") await p.evaluate(() => { document.querySelector('input[name="botcheck"]').checked = true; });
    await p.click('#contact button[type="submit"]');
    await sleep(800);
    const msg = await p.evaluate(() => document.querySelector("#contact form p:last-of-type")?.textContent || "");
    const expectOk = scenario === "success" || scenario === "honeypot";
    ok(`form ${scenario}: shows ${expectOk ? "success" : "error"} message`, expectOk ? /sent/i.test(msg) : /didn.t send/i.test(msg), msg);
    if (scenario === "honeypot") ok("form honeypot: nothing posted", posted === null);
    if (scenario === "success") ok("form success: posts access_key + fields, no botcheck", posted && /access_key/.test(posted) && /test@example.com/.test(posted) && !/botcheck/.test(posted));
    const v = await p.evaluate(() => window.__csp);
    ok(`form ${scenario}: no CSP violations`, v.length === 0, v.join("|"));
    await p.close();
  }
  {
    const p = await newPage(b);
    await p.goto(`${BASE}/en/`, { waitUntil: "networkidle0" });
    const lim = await p.evaluate(() => ["contact-name","contact-email","contact-business","contact-message"].map(id => document.getElementById(id).maxLength));
    ok("form fields have length limits", lim.every(n => n > 0), lim.join(","));
    await p.close();
  }

  // ── 4. Navigation: language switch keeps hash, skip link, mobile menu
  {
    const p = await newPage(b);
    await p.goto(`${BASE}/en/#faq`, { waitUntil: "networkidle0" });
    await Promise.all([p.waitForNavigation(), p.click("header a[lang='ar']")]);
    const u = p.url(); const stored = await p.evaluate(() => localStorage.getItem("yy-locale"));
    ok("language switch → /ar/ keeps #faq and saves yy-locale", u.endsWith("/ar/#faq") && stored === "ar", u + " " + stored);
    await p.goto(`${BASE}/en/#%22%3E%3Cimg%20src=x%20onerror=alert(1)%3E`, { waitUntil: "networkidle0" });
    await Promise.all([p.waitForNavigation(), p.click("header a[lang='ar']")]);
    const v = await p.evaluate(() => ({ csp: window.__csp, imgs: document.querySelectorAll("img[src='x']").length }));
    ok("language switch with hostile #hash stays a harmless same-origin URL", new URL(p.url()).pathname === "/ar/" && v.imgs === 0, p.url());
    await p.goto(`${BASE}/en/`, { waitUntil: "networkidle0" });
    await p.keyboard.press("Tab");
    const focused = await p.evaluate(() => ({ cls: document.activeElement.className, outline: getComputedStyle(document.activeElement).outlineStyle }));
    ok("first Tab focuses skip link with visible focus ring", /skip-to-content/.test(focused.cls) && focused.outline !== "none", JSON.stringify(focused));
    await p.close();
    const m = await newPage(b, { w: 375, h: 812 });
    await m.goto(`${BASE}/ar/`, { waitUntil: "networkidle0" });
    await m.click("header button[aria-expanded]");
    const open = await m.evaluate(() => document.querySelector("header button[aria-expanded]").getAttribute("aria-expanded"));
    await m.keyboard.press("Escape"); await sleep(100);
    const closed = await m.evaluate(() => document.querySelector("header button[aria-expanded]").getAttribute("aria-expanded"));
    ok("mobile menu opens and Escape closes it", open === "true" && closed === "false");
    await m.close();
  }

  // ── 5. Intro "/" in its main variants
  const intro = async (name, opts, action) => {
    const p = await newPage(b, opts);
    await p.goto(`${BASE}/`, { waitUntil: "networkidle0" });
    const nav = p.waitForNavigation({ timeout: 25000 }).then(() => p.url()).catch(() => "no-navigation");
    await action(p);
    const url = await nav;
    ok(`intro ${name}`, url.endsWith(opts.expect), url + (p._err.length ? " errors: " + p._err.join("|") : ""));
    await p.close();
  };
  const clickEnter = async (p) => { const sel = ".intro-enter"; await p.waitForFunction(s => { const el = document.querySelector(s); return el && getComputedStyle(el).pointerEvents !== "none" && getComputedStyle(el).opacity > 0.5; }, { timeout: 15000 }, sel).catch(() => {}); const v0 = await p.evaluate(() => window.__csp); if (v0.length) results.push(["FAIL", "intro CSP violations", v0.join("|")]); await p.click(sel).catch(e => results.push(["FAIL", "intro enter click", e.message])); };
  await intro("first visit (en browser) → /en/", { expect: "/en/" }, clickEnter);
  await intro("first visit (ar browser) → /ar/", { lang: "ar-SA", expect: "/ar/" }, clickEnter);
  await intro("returning visitor (yy-intro-seen) → /en/", { storage: { "yy-intro-seen": "1" }, expect: "/en/" }, clickEnter);
  await intro("saved yy-locale=ar wins over browser language", { storage: { "yy-locale": "ar" }, expect: "/ar/" }, clickEnter);
  await intro("garbage yy-locale ignored (no open redirect)", { storage: { "yy-locale": "//evil.example" }, expect: "/en/" }, clickEnter);
  await intro("reduced motion → button navigates", { reduced: true, expect: "/en/" }, clickEnter);
  await intro("Skip works immediately", { expect: "/en/" }, async (p) => { await sleep(500); await p.click(".intro-skip"); });
  await intro("portrait phone → /en/", { w: 390, h: 844, expect: "/en/" }, clickEnter);

  // ── 6. Static files
  for (const [u, re] of [["/robots.txt", /Sitemap: https:\/\/yameenyasar.com\/sitemap.xml/], ["/sitemap.xml", /yameenyasar.com\/ar\//], ["/.well-known/security.txt", /Contact: mailto:hello@yameenyasar.com/]]) {
    const t = await (await fetch(BASE + u)).text(); ok(`${u} served`, re.test(t));
  }
  const nf = await fetch(BASE + "/does-not-exist/"); ok("unknown path → 404 page", nf.status === 404);
  const ds = await fetch(BASE + "/.DS_Store"); ok(".DS_Store not deployed", ds.status === 404);

  await b.close();
  server.close();
  for (const [s, n, i] of results) console.log(s, "|", n, i && s === "FAIL" ? "→ " + i : "");
  const failed = results.filter(r => r[0] === "FAIL").length;
  console.log(`\n${results.length - failed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
})();
