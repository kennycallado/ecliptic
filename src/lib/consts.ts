export const TRACES: boolean = process.env.TRACES === "true" ? true : false;
export const LOGS: boolean = process.env.LOGS === "true" ? true : false;

export const BASE: string = process.env.BASE_URL || "/";
export const SITE: string = process.env.SITE ||
  `http://localhost:${import.meta.env.PROD ? 8000 : 3000}`;
