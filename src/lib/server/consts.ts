// export const BASE = process.env.BASE_URL || "/";
// export const SITE = process.env.SITE_URL || import.meta.env.SITE;

const url = process.env.PUBLIC_DB_ENDPOINT;

// url: import.meta.env.PUBLIC_DB_ENDPOINT + `${BASE}db`,
export type DBConfig = typeof DB;
export const DB = {
  url,
  config: {
    username: process.env.SECRET_DB_USERNAME,
    password: process.env.SECRET_DB_PASSWORD,
    database: "ecliptic",
    namespace: "webslab",
  },
};
