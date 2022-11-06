import { IRedisAdapter } from "./infrastructure";

export enum SubscribeNameSpace {
  POST_CONTACT_CREATED = 'POST_CONTACT_CREATED',
  POST_CONTACT_NOT_CREATED = 'POST_CONTACT_NOT_CREATED'
}

export enum CacheNamespace {
  Contact = 'Contact'
}


export interface ISystemRepository {
  healthcheck(): Promise<void>;
  redis(): IRedisAdapter
}

export interface ISystemService {
  healthcheck(): Promise<void>;
  redis(): IRedisAdapter | null
}

export interface ISystemUseCase {
  healthcheck(): Promise<void>;
  redis(): IRedisAdapter | null
}
