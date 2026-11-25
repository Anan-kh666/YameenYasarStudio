/* Fictional catalog for the Qalam demo. Order matches content.courses. */

export type Level = "beginner" | "intermediate" | "advanced";
export type Category = "design" | "development" | "data" | "business" | "writing";
export type Cover = "palette" | "pen" | "message" | "braces" | "atom" | "chart" | "brain" | "megaphone";

export type Course = {
  id: string;
  category: Category;
  level: Level;
  lessons: number;
  hours: number;
  rating: number;
  reviews: number;
  /** USD, 0 = free. */
  price: number;
  cover: Cover;
  /** Cover tint (HSL hue). */
  hue: number;
  featured?: boolean;
};

export const COURSES: Course[] = [
  { id: "ui-design", category: "design", level: "beginner", lessons: 18, hours: 6, rating: 4.8, reviews: 1240, price: 49, cover: "palette", hue: 262 },
  { id: "calligraphy", category: "design", level: "intermediate", lessons: 12, hours: 5, rating: 4.9, reviews: 860, price: 59, cover: "pen", hue: 28 },
  { id: "ux-writing", category: "writing", level: "intermediate", lessons: 14, hours: 2.5, rating: 4.9, reviews: 2310, price: 79, cover: "message", hue: 285, featured: true },
  { id: "javascript", category: "development", level: "beginner", lessons: 24, hours: 9, rating: 4.7, reviews: 3020, price: 0, cover: "braces", hue: 45 },
  { id: "react", category: "development", level: "advanced", lessons: 32, hours: 14, rating: 4.8, reviews: 1510, price: 89, cover: "atom", hue: 200 },
  { id: "python-data", category: "data", level: "intermediate", lessons: 22, hours: 8, rating: 4.8, reviews: 1980, price: 69, cover: "chart", hue: 160 },
  { id: "machine-learning", category: "data", level: "advanced", lessons: 28, hours: 12, rating: 4.6, reviews: 720, price: 99, cover: "brain", hue: 320 },
  { id: "marketing", category: "business", level: "beginner", lessons: 16, hours: 5, rating: 4.7, reviews: 1150, price: 39, cover: "megaphone", hue: 12 },
];

export const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];
export const CATEGORIES: Category[] = ["design", "development", "data", "business", "writing"];

export const FEATURED_PRICE = { now: 79, was: 129 };
/** Lessons already ticked when the page loads ("module-lesson"). */
export const INITIALLY_DONE = ["0-0", "0-1", "0-2", "1-0"];
