export const AUTH_SECRET = process.env.SECRET_BETTER_AUTH_SECRET!;

export type DBConfig = typeof DB_SERVER;
export const DB_SERVER = {
  url: process.env.PUBLIC_DB_ENDPOINT!,
  config: {
    username: process.env.SECRET_DB_USERNAME!,
    password: process.env.SECRET_DB_PASSWORD!,
    database: process.env.PUBLIC_PROJECT_NAME,
    namespace: process.env.PUBLIC_PROJECT_SPEC,
  },
};
