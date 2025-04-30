const trailing = import.meta.env.PROD ? "/" : "";
const port = import.meta.env.PROD
  ? (import.meta.env.PREV ? ":3000" : ":8000")
  : ":3000";

export const TRACES = import.meta.env.PUBLIC_TRACES === "true";
export const LOGS = import.meta.env.PUBLIC_LOGS === "true";
export const SITE = import.meta.env.SITE_URL || import.meta.env.SITE + port;
export const BASE = import.meta.env.BASE_URL + trailing;

export type DBConfig = typeof DB;
export const DB = {
  url: import.meta.env.PUBLIC_DB_ENDPOINT!,
  config: {
    access: "users",
    database: "ecliptic",
    namespace: "webslab",
  },
};
