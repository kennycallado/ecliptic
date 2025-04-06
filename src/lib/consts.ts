export const BASE = process.env.BASE_URL || "/";
export const SITE = process.env.SITE ||
  `http://localhost:${import.meta.env.PROD ? 8000 : 3000}`;
