import database from "@util/knex";

import {
  MysqlDatabase,
  IMysqlAdapter,
  MysqlAdapterConfig,
} from "@type/infrastructure";

export class MysqlAdapter implements IMysqlAdapter {
  private _tbName: string;
  private database: MysqlDatabase;

  constructor(config?: MysqlAdapterConfig) {
    this.database = config?.dbConn || database;
    this._tbName = "";
  }

  get db() {
    return this.database(this._tbName);
  }

  get knex() {
    return this.database;
  }

  set tableName(name: string) {
    this._tbName = name;
  }
}
