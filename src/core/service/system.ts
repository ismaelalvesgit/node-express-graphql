import { ServiceContext } from "@type/core";
import { ISystemService } from "@type/system";
import { env } from "@util/env";

export class SystemService implements ISystemService {
  private systemRepository: ServiceContext["systemRepository"];

  constructor(ctx: ServiceContext) {
    this.systemRepository = ctx.systemRepository;
  }
  
  healthcheck(): Promise<void> {
    return this.systemRepository.healthcheck();
  }

  redis() {
    if(env.redis.host){
      return this.systemRepository.redis();
    }
    return null;
  }
} 
