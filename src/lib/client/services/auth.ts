import { Surreal } from "surrealdb";
import { createAuthClient } from "better-auth/client";

import { BASE, DB, type DBConfig } from "$lib/client/consts.ts";

class Auth {
  public isReady: Promise<boolean>;
  public client = createAuthClient({
    basePath: BASE + "api/auth", // needed exactly

    fetchOptions: {
      onRequest: (ctx) => {
        // TODO: check astro.config.trailingSlash
        ctx.url = ctx.url + "/";
      },
    },
  });

  private db = new Surreal();

  private user?: object;
  private client_token?: string;
  private session_token?: string; // able to refresh

  constructor(private dbconfig: DBConfig) {
    const user = localStorage.getItem("user");

    this.user = user ? JSON.parse(user) : undefined;
    this.client_token = localStorage.getItem("client_token") || undefined;

    this.isReady = this.initialize();
  }

  private async initialize(): Promise<boolean> {
    try {
      await this.db.ready;

      try {
        await this.db.connect(this.dbconfig.url, { ...this.dbconfig.config });
      } catch (error) {
        console.error("Failed to connect to database:", error);
        return false;
      }

      if (this.client_token) {
        try {
          await this.db.authenticate(this.client_token);
        } catch (_) {
          this.clearAuth();
          location.href = "";
        }
      }

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public signUp(
    credentials: { email: string; password: string; name: string },
  ) {
    return this.client.signUp.email({
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      image: undefined, // User image URL (optional)
    });
  }

  public signIn(credentials: { email: string; password: string }) {
    return this.client.signIn.email({
      email: credentials.email,
      password: credentials.password,
      // callbackURL: BASE, // TODO: maybe SITE BASE

      fetchOptions: {
        onSuccess: ({ data }) => {
          this.session_token = data.token;
          this.setUser(data.user);

          // then client_token
          this.client.getSession({
            fetchOptions: {
              onSuccess: async ({ data }) => {
                const client_token = data.session.client_token.token;

                try {
                  await this.db.authenticate(client_token);
                  this.setToken(client_token);
                } catch (e) {
                  console.error("Failed to authenticate with client token:", e);

                  this.clearAuth();
                  location.href = "";
                }
              },
            },
          });
        },
      },
    });
  }

  public refresh() {
    return this.client.getSession({
      fetchOptions: {
        onSuccess: async ({ data }) => {
          const client_token = data.session.client_token.token;

          this.session_token = data.token;
          this.setUser(data.user);

          try {
            await this.db.authenticate(client_token);
            this.setToken(client_token);
          } catch (_) {
            this.clearAuth();
            location.href = "";
          }
        },
      },
    });
  }

  public signOut() {
    return this.client.signOut({
      fetchOptions: {
        onSuccess: () => {
          this.clearAuth();

          location.href = "";
        },
      },
    });
  }

  public getDB() {
    return this.db;
  }

  private setToken(token: string) {
    this.client_token = token;
    localStorage.setItem("client_token", token);
  }

  private clearToken() {
    this.client_token = undefined;
    localStorage.removeItem("client_token");
  }

  public getUser() {
    return this.user;
  }

  private setUser(user: object) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }

  private clearUser() {
    this.user = undefined;
    localStorage.removeItem("user");
  }

  private clearAuth() {
    this.clearToken();
    this.clearUser();
  }
}

export const auth = new Auth(DB);
