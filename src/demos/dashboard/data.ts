/* Fictional numbers for the Rasid demo. Generated from a fixed seed so the
   server render and the browser produce exactly the same values (no hydration
   mismatch) and every visit shows the same story. */

export type Range = "7d" | "30d" | "90d";
export const RANGES: Range[] = ["7d", "30d", "90d"];
const DAYS: Record<Range, number> = { "7d": 7, "30d": 30, "90d": 90 };

// Last day shown is 24 Nov 2026 (UTC, so server and browser agree).
const END = Date.UTC(2026, 10, 24);
const DAY_MS = 86_400_000;

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Day = { month: number; day: number; revenue: number; orders: number };

// 180 days, oldest first: a slow upward trend, Thu/Fri peaks (Saudi weekend), noise.
const rand = seeded(20261124);
const HISTORY: Day[] = Array.from({ length: 180 }, (_, i) => {
  const date = new Date(END - (179 - i) * DAY_MS);
  const weekday = date.getUTCDay();
  const weekend = weekday === 4 || weekday === 5 ? 1.28 : 1;
  const revenue = Math.round((9800 + i * 34 + rand() * 2600) * weekend);
  const aov = 286 + rand() * 48;
  return { month: date.getUTCMonth(), day: date.getUTCDate(), revenue, orders: Math.round(revenue / aov) };
});

const CONVERSION: Record<Range, [number, number]> = { "7d": [3.42, 3.18], "30d": [3.21, 3.27], "90d": [3.05, 2.71] };
const CHANNEL_SHARE: Record<Range, [number[], number[]]> = {
  "7d": [[0.38, 0.27, 0.16, 0.12, 0.07], [0.4, 0.24, 0.15, 0.13, 0.08]],
  "30d": [[0.4, 0.25, 0.15, 0.12, 0.08], [0.42, 0.22, 0.14, 0.13, 0.09]],
  "90d": [[0.41, 0.23, 0.14, 0.13, 0.09], [0.45, 0.19, 0.12, 0.14, 0.1]],
};
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const pct = (now: number, before: number) => ((now - before) / before) * 100;

export function rangeData(range: Range) {
  const n = DAYS[range];
  const current = HISTORY.slice(-n);
  const previous = HISTORY.slice(-2 * n, -n);
  const rev = sum(current.map((d) => d.revenue));
  const prevRev = sum(previous.map((d) => d.revenue));
  const orders = sum(current.map((d) => d.orders));
  const prevOrders = sum(previous.map((d) => d.orders));
  const [conv, prevConv] = CONVERSION[range];
  const [share, prevShare] = CHANNEL_SHARE[range];
  return {
    current,
    previous,
    kpis: {
      revenue: { value: rev, delta: pct(rev, prevRev) },
      orders: { value: orders, delta: pct(orders, prevOrders) },
      conversion: { value: conv, delta: pct(conv, prevConv) },
      aov: { value: rev / orders, delta: pct(rev / orders, prevRev / prevOrders) },
    },
    channels: share.map((s, i) => ({ current: Math.round(rev * s), previous: Math.round(prevRev * prevShare[i]) })),
    // Units sold per product scale with the range (every value stays above 10 for Arabic counting).
    products: [482, 391, 306, 254, 188].map((u) => Math.round(u * { "7d": 0.26, "30d": 1, "90d": 2.84 }[range])),
  };
}

export type Status = "paid" | "shipped" | "refunded";
/** customer/channel are indexes into content.customers / content.channelChart.channels. */
export const ORDERS: { id: string; customer: number; month: number; day: number; channel: number; status: Status; amount: number }[] = [
  { id: "RS-2304", customer: 0, month: 10, day: 24, channel: 0, status: "paid", amount: 412 },
  { id: "RS-2303", customer: 1, month: 10, day: 24, channel: 1, status: "paid", amount: 186 },
  { id: "RS-2301", customer: 2, month: 10, day: 23, channel: 2, status: "shipped", amount: 940 },
  { id: "RS-2298", customer: 3, month: 10, day: 23, channel: 0, status: "shipped", amount: 275 },
  { id: "RS-2294", customer: 4, month: 10, day: 22, channel: 3, status: "refunded", amount: 158 },
  { id: "RS-2291", customer: 5, month: 10, day: 22, channel: 1, status: "shipped", amount: 1320 },
  { id: "RS-2287", customer: 6, month: 10, day: 21, channel: 4, status: "paid", amount: 620 },
  { id: "RS-2282", customer: 7, month: 10, day: 21, channel: 0, status: "shipped", amount: 348 },
  { id: "RS-2279", customer: 8, month: 10, day: 20, channel: 2, status: "paid", amount: 89 },
  { id: "RS-2266", customer: 9, month: 10, day: 19, channel: 0, status: "refunded", amount: 515 },
];

export type ActivityKind = "order" | "review" | "stock" | "refund" | "customer" | "shipped";
/** Same order as content.activity.events. */
export const ACTIVITY: { kind: ActivityKind; ref?: string; amount?: number }[] = [
  { kind: "order", ref: "RS-2305", amount: 412 },
  { kind: "review" },
  { kind: "stock" },
  { kind: "order", ref: "RS-2306", amount: 238 },
  { kind: "refund", ref: "RS-2266", amount: 515 },
  { kind: "customer" },
  { kind: "shipped", ref: "RS-2301" },
  { kind: "order", ref: "RS-2307", amount: 1075 },
];
