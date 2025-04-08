import { Surreal } from "surrealdb";
import { DB, type DBConfig } from "$lib/client/consts.ts";

class Auth {
  isReady: Promise<boolean>;

  private db = new Surreal();
  private token?: string;
  private user?: object;

  constructor(private dbconfig: DBConfig) {
    const user = localStorage.getItem("user");

    this.user = user ? JSON.parse(user) : undefined;
    this.token = localStorage.getItem("token") || undefined;

    this.isReady = this.initialize();
  }

  public logout() {
    this.clearAuth();
  }

  public async signin(
    username?: string,
    password?: string,
    access?: string,
  ): Promise<boolean> {
    if (await this.isReady) {
      if (!access || this.dbconfig.config.access) {
        if (!this.dbconfig) {
          Promise.reject("Access not provided");
          return Promise.resolve(false);
        }

        if (!this.dbconfig.config.access) {
          Promise.reject("Access not provided");
          return Promise.resolve(false);
        }

        access = this.dbconfig.config.access;
      }

      // at this point surreal could throw an error
      try {
        const token = await this.db.signin({
          access: this.dbconfig.config.access,
          variables: { username, password },
        });

        this.setToken(token);
        this.db.authenticate(token);
      } catch (e) {
        // console.error(e);

        Promise.reject("Access denied: " + e);
        return Promise.resolve(false);
      }

      const user = await this.db.info();

      if (!user || !user.id) {
        // If no user info returned or user is invalid, clear authentication
        this.clearAuth();
        Promise.reject("Access denied");
        return Promise.resolve(false);
      } else {
        this.setUser(user);
        return Promise.resolve(true);
      }
    }

    Promise.reject("Service not ready");
    return Promise.resolve(false);
  }

  private async initialize(): Promise<boolean> {
    try {
      await this.db.ready;

      try {
        await this.db.connect(this.dbconfig.url, {
          ...this.dbconfig.config,
          // prepare: async (db: Surreal) => {
          // 	if (this.token) {
          // 		// could fail if the token is invalid, expired
          // 		await db.authenticate(this.token);
          // 	}
          //
          // 	this._isReady = true;
          // },
        });

        // this.isReady = true;
        // return true;
      } catch (error) {
        console.error("Failed to connect to database:", error);

        Promise.reject(error);
        // throw error;
        // return false;
      }

      if (this.token) {
        try {
          await this.db.authenticate(this.token);
        } catch (_) {
          // console.error(_);
          this.clearAuth();
        }
      }

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public getDB() {
    return this.db;
  }

  public getUser() {
    return this.user;
  }

  public getToken() {
    return this.token;
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  private clearToken() {
    this.token = undefined;
    localStorage.removeItem("token");
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

// export const auth = new Auth(DB);
