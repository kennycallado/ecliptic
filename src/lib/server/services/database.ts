import { Surreal } from "surrealdb";
import { DB_SERVER } from "$lib/server/consts.ts";
import { catchErrorTyped } from "$lib/utils.ts";

class Database {
  private _db = new Surreal();
  private _dbconfig = DB_SERVER;

  private _isReady?: Promise<void>;

  constructor() {
    this._isReady = this.initialize();
  }

  private async initialize() {
    { // scoped: db ready
      const { error } = await catchErrorTyped(this._db.ready);
      if (error) throw new Error("Database is not ready");
    }

    const connection = this._db.connect(this._dbconfig.url, {
      namespace: this._dbconfig.config.namespace,
      database: this._dbconfig.config.database,
      auth: this._dbconfig.config,
    });

    { // scoped: connection
      const { error } = await catchErrorTyped(connection);
      if (error) throw new Error("Failed to connect to database");
    }
  }

  private async ensureInitialized(): Promise<void> {
    const { error } = await catchErrorTyped(this._isReady!);

    if (error) {
      this._isReady = undefined;
      throw new Error("Database initialization failed");
    }
  }

  async getDB(): Promise<Surreal> {
    await this.ensureInitialized();

    const { error } = await catchErrorTyped({
      promise: this._db.info(),
      options: {
        retry: async () => {
          // Reintento: reinicializa y espera
          this._isReady = this.initialize();

          const { error } = await catchErrorTyped(this._isReady);
          if (error) {
            this._isReady = undefined;
            throw new Error("Database reinitialization failed");
          }

          return await this._db.info();
        },
      },
    });

    if (error) {
      this._isReady = undefined;
      throw new Error("Database is not ready after retry");
    }

    return this._db;
  }
}

export const dbService = new Database();
