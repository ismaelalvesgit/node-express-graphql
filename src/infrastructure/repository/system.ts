import {
  Env,
  IRedisAdapter,
  IRedisAdapterConstructs,
} from "@type/infrastructure";
import { ISystemRepository } from "@type/system";
import knex from "@util/knex";

export type Context = {
  config: Env;
  redisAdapter: IRedisAdapterConstructs;
};

export class SystemRepository implements ISystemRepository {
  private clientRedis: IRedisAdapter;

  constructor({ config,
    redisAdapter, }: Context) {
    this.clientRedis = new redisAdapter({
      host: config.redis.host,
      port: config.redis.port,
      db: config.redis.db,
      keyPrefix: config.redis.prefix
    });
  }

  healthcheck(): Promise<void> {
    return knex.raw("select 1+1 as result");
  }

  redis(): IRedisAdapter {
    return this.clientRedis;
  }
}
