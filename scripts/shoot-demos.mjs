// Screenshots of every concept demo for the Work section cards
// (run `npm run build` first):
//   npm run shoot:demos
//
// Serves out/, opens each folder in out/demos/ar/ in both locales and saves
//   public/images/work/<slug>-<locale>.webp     desktop 1440×900, DPR 1
//   public/images/work/<slug>-<locale>-m.webp   phone   390×844,  DPR 2
// with reduced motion, fonts loaded and the studio's .demo-bar hidden, so it
// looks like the client's own site. Commit the images, then rebuild.
//
// Uses the installed Google Chrome; set CHROME_PATH to use another one.

import puppeteer from "puppeteer-core";
import http from "node:http";
import { existsSync, statSync, createReadStream, readdirSync } from "node:fs";
import path from "node:path";

const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = path.resolve("out");
const DEST = path.resolve("public/images/work");
const VIEWS = [
  { suffix: "", viewport: { width: 1440, height: 900, deviceScaleFactor: 1 } },
  { suffix: "-m", viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } },
];

const demoDir = path.join(OUT, "demos", "ar");
if (!existsSync(demoDir)) { console.error("No out/demos/ar/ — run `npm run build` first."); process.exit(1); }
// Skip iCloud conflict copies like "store 2"
const slugs = readdirSync(demoDir, { withFileTypes: true }).filter(d => d.isDirectory() && !/ \d+$/.test(d.name)).map(d => d.name);

// Plain static server (no headers needed for screenshots); port 0 = any free port
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".mp4": "video/mp4" };
const server = http.createServer((req, res) => {
  let file = path.join(OUT, decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(OUT)) { res.writeHead(400); return res.end(); }
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!existsSync(file)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, r));
const BASE = `http://localhost:${server.address().port}`;

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
let failed = false;
try {
  for (const slug of slugs) for (const loc of ["ar", "en"]) for (const { suffix, viewport } of VIEWS) {
    const p = await browser.newPage();
    await p.setViewport(viewport);
    await p.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    const resp = await p.goto(`${BASE}/demos/${loc}/${slug}/`, { waitUntil: "networkidle0" });
    if (resp.status() !== 200) { console.error(`✗ ${slug} ${loc}: HTTP ${resp.status()}`); failed = true; await p.close(); continue; }
    await p.addStyleTag({ content: ".demo-bar { display: none !important; }" });
    await p.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 800)); // let layout and images settle
    const file = path.join(DEST, `${slug}-${loc}${suffix}.webp`);
    await p.screenshot({ path: file, type: "webp", quality: 80 });
    console.log(`✓ ${path.relative(process.cwd(), file)}  ${(statSync(file).size / 1024).toFixed(0)} KB`);
    await p.close();
  }
} finally {
  await browser.close();
  server.closeAllConnections(); // keep-alive sockets would keep the process alive
  server.close();
}
console.log(`${slugs.length} demo(s): ${slugs.join(", ") || "none"}`);
if (failed) process.exit(1);
