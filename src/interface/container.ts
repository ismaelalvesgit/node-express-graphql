import { AmqpInterface } from "./amqp";
import { HttpInterface } from "./http";
import {
  createContainer as createCoreContainer,
} from "../core/container";

import {
  createContainer as createInfraContainer,
} from "../infrastructure/container";

import {
  IHttpInterface,
  IAmqpInterface,
  ICronInterface,
} from "@type/interface";
import { CronInterface } from "./cron";
import { Env } from "@type/infrastructure";

type ContainerConfig = {
  env: Env;
  init: {
    http?: boolean;
    amqp?: boolean;
    cli?: boolean;
    cron?: boolean;
    socket?: boolean;
  };
};

type Container = {
  httpInterface?: IHttpInterface;
  amqpInterface?: IAmqpInterface;
  cronInterface?: ICronInterface;
};

export function createContainer(config: ContainerConfig): Container {
  const container: Container = {};

  const infraContainer = createInfraContainer(config.env);
  const coreContainer = createCoreContainer(infraContainer);

  if (config.init.http) {
    container.httpInterface = new HttpInterface({
      env: config.env,
      coreContainer,
    });
  }

  if (config.init.amqp) {
    container.amqpInterface = new AmqpInterface({
      env: config.env, 
      coreContainer
    });
  }

  if(config.init.cron){
    container.cronInterface = new CronInterface({
      env: config.env, 
      coreContainer
    });
  }

  return container;
}
