import { Surreal } from "surrealdb";
import { DB } from "$lib/server/consts.ts";

class Database {
  isReady: Promise<boolean>;
  db = new Surreal();

  constructor(private dbconfig: typeof DB) {
    this.isReady = this.initialize();
  }

  private async initialize() {
    try {
      await this.db.ready;
    } catch (e) {
      console.error("Database not ready:", e);
      return Promise.resolve(false);
    }

    try {
      await this.db.connect(this.dbconfig.url, {
        ...this.dbconfig.config,
      });
    } catch (e) {
      console.error("Failed to connect to database:", e);
      Promise.reject(false);
    }

    return true;
  }
}

export const db = new Database(DB);
