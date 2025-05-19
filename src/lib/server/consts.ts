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

export const VAPID = {
  secret: process.env.SECRET_VAPID!,
  public: process.env.PUBLIC_VAPID!,
};

export const MAIL = {
  host: process.env.SECRET_MAIL_HOST,
  port: process.env.SECRET_MAIL_PORT,
  auth: {
    user: process.env.SECRET_MAIL_USERNAME,
    pass: process.env.SECRET_MAIL_PASSWORD,
  },
};
