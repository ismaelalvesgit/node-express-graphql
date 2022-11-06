import {
  Router,
  Request,
  Response,
  NextFunction,
} from "express";
import { Channel, ConsumeMessage } from "amqplib";
import { AnySchema } from "joi";
import { Container } from "./core";
import { Server, Socket } from "socket.io";
import { I18n, TranslateOptions, Replacements } from "i18n";

declare module 'express-serve-static-core' {
  interface Request {
    requestId: string
  }
}

declare module 'express' {
  interface Request {
    requestId: string
  }
}

export interface ValidationOptions {
  i18n?: string;
  requestId?: string;
}

export interface ValidationParams {
  schema: AnySchema;
  params: object;
  errorMsg: string;
}

export interface Pagination {
  size?: number
  page?: number
  sortBy?: string
  sort?: 'ASC' | 'DESC'
}


export type GraphqlSubscriptionHandler = {
  subscribe: (parent: string, agrs: any, context: IContext)=> AsyncIterator<T>
}
export type GraphqlHandler = (parent: string, agrs: any, context: IContext)=> Promise<unknown>

/* GRAPHQL Interface */
export type SubscriptionParams = Record<string, GraphqlSubscriptionHandler>
export type ResolverParams = Record<string, GraphqlHandler>

/* HTTP Interface */
export type HttpRouter = Router;
export type HttpRequest = Request;
export type HttpResponse = Response;
export type HttpNext = NextFunction;

export type HttpControllerConfig = {
  coreContainer: Container;
};

export interface IHttpRoute {
  register(r: HttpRouter): void;
}

export interface IHttpInterface {
  serve(): Promise<void>;
}

export interface IContext {
  coreContainer: Container;
  requestId: string
  i18n: (phraseOrOptions: string | TranslateOptions,  replacements: Replacements) => string
};

/* AMQP Interface */
export type AmqpChannel = Channel;
export type AmqpMessage = ConsumeMessage;
export type AmqpParsedMessage<T> = Record<"content", T | undefined> & AmqpMessage;
export type AmqpMessageHandler = (msg: AmqpMessage | null) => void | Promise<void>;

export type AmqpOnConsumeFunction = (
  channel: AmqpChannel,
  finisher: FinisherFunction,
  ...msgHandlers: import("../interface/amqp/middlewares/handlers").FuncHandler[]
) => (message: AmqpMessage | null) => Promise<void>;

export type FinisherFunction = (channel: AmqpChannel, message: AmqpMessage, error?: unknown) => unknown;

export interface IAmqpInterface {
  connect(): Promise<void>;
}

export interface IAmqpConsumer {
  assertQueue(channel: AmqpChannel): void;
}

export interface ISocketConsumer {
  init(): void;
}

export type AmqpConsumerConfig = {
  coreContainer: Container;
  _onConsume: AmqpOnConsumeFunction;
};

export interface ICronInterface {
  start(): void;
}

export type CronJobConfig = {
  coreContainer: Container;
};

export interface IJob {
  run(): void | Promise<void> | Promise<string>;
}