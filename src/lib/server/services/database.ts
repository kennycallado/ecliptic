import { Surreal } from "surrealdb";
import { DB_SERVER } from "$lib/server/consts.ts";

class Database {
  isReady: Promise<boolean>;
  db = new Surreal();

  constructor(private dbconfig: typeof DB_SERVER) {
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
        namespace: this.dbconfig.config.namespace,
        database: this.dbconfig.config.database,
        auth: this.dbconfig.config,
      });
    } catch (e) {
      console.error("Failed to connect to database:", e);
      Promise.reject(false);
    }

    return true;
  }
}

export const db = new Database(DB_SERVER);
