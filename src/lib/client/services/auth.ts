import { Surreal } from "surrealdb";
import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";

import { BASE, DB, type DBConfig } from "$lib/client/consts.ts";
import { catchErrorTyped } from "$lib/utils.ts";

import { adminRole, theraRoles, userRole } from "$lib/roles.ts";
import type { User } from "$lib/types.ts";

class AuthService {
  public isReady: Promise<boolean>;
  public client = createAuthClient({
    basePath: BASE + "api/auth", // NOTE: needed

    fetchOptions: {
      onRequest: (ctx) => {
        // TODO: check astro.config.trailingSlash
        ctx.url = ctx.url + "/";
      },
    },

    plugins: [
      adminClient({
        roles: {
          admin: adminRole,
          user: userRole,
          thera: theraRoles,
        },
      }),
    ],
  });

  private db = new Surreal();

  private user?: User;
  private token?: string;

  constructor(private dbconfig: DBConfig) {
    const user = localStorage.getItem("user");

    this.user = user ? JSON.parse(user) : undefined;
    this.token = localStorage.getItem("token") || undefined;

    this.isReady = this.init();
  }

  private async init(): Promise<boolean> {
    // check db is ready
    const { error: errorReady } = await catchErrorTyped(this.db.ready);
    if (errorReady) return false;

    // connect to db
    const { error: errorConnect } = await catchErrorTyped(
      this.db.connect(this.dbconfig.url, { ...this.dbconfig.config }),
    );
    if (errorConnect) return false;

    if (this.token) {
      // authenticate with token
      const { error: errorAuth } = await catchErrorTyped(
        this.db.authenticate(this.token),
      );
      if (errorAuth) this.clearToken();
    }

    return true;
  }

  public async refresh() {
    const { error: errorSession, data: dataSession } = await this.client
      .getSession();

    if (errorSession) {
      console.error("Failed to refresh session:", errorSession);
      return { error: errorSession, data: null };
    }

    const { user, session } = dataSession;
    this.setUser(user as User);

    const signinOptions = {
      access: this.dbconfig.config.access,
      variables: { email: user.email, sessionId: session.id },
    };

    const { error, data: token } = await catchErrorTyped({
      promise: this.db.signin(signinOptions),
      options: {
        retry: async () => {
          await this.db.close();
          await this.db.ready;
          await this.init();

          return this.db.signin(signinOptions);
        },
      },
    });

    if (error) return { error, data: null };
    if (!token) return { error: new Error("No token retrived"), data: null };

    this.setToken(token);

    return { error: null, data: dataSession };
  }

  public signUp(
    credentials: { email: string; password: string; name: string },
  ) {
    return this.client.signUp.email({
      email: credentials.email,
      password: credentials.password,
      name: credentials.name,
      image: undefined, // User image URL (optional)
      // fetchOptions: { onSuccess: () => { this.refresh(); } },
    });
  }

  public async signIn(credentials: { email: string; password: string }) {
    const { error } = await this.client.signIn.email({
      email: credentials.email,
      password: credentials.password,
      // fetchOptions: { onSuccess: () => this.refresh() },
    });

    if (error) {
      console.error("Failed to sign in:", error);
      return { error, data: null };
    }

    return this.refresh();
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

  public async getWsDb(token?: string): Promise<Surreal> {
    if (!this.db || !this.isReady) {
      throw new Error("Database is not ready yet");
    }

    const url = new URL(this.dbconfig.url);
    if (url.protocol.includes("ws")) return this.db;

    const db = new Surreal();
    const protocol = url.protocol.includes("https") ? "wss" : "ws";
    const endpoint = url.host + url.pathname;

    await db.connect(`${protocol}:${endpoint}`, { ...this.dbconfig.config });

    if (token) await db.authenticate(token);

    return db;
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  private clearToken() {
    this.token = undefined;
    localStorage.removeItem("token");
  }

  public getUser() {
    return this.user;
  }

  private setUser(user: User) {
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

export const auth = new AuthService(DB);
