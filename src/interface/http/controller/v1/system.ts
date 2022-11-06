import httpStatus from "http-status-codes";
import { Logger } from "@util/logger";
import {
  IHttpRoute,
  HttpControllerConfig,
  HttpRouter,
  HttpRequest,
  HttpResponse,
  HttpNext
} from "@type/interface";


export class SystemController implements IHttpRoute {
  private systemUseCase: HttpControllerConfig["coreContainer"]["systemUseCase"];

   constructor({
    coreContainer,
  }: HttpControllerConfig) {
    this.systemUseCase = coreContainer.systemUseCase;
  }

  register(r: HttpRouter) {
    r.route("/system/healthcheck")
      .get(
        this.healthcheck.bind(this),
      );

    Logger.debug(
      {
        class: "ContactController",
        classType: "HttpController",
      },
      "route registration end",
    );
  }

  healthcheck(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    this.systemUseCase.healthcheck().then(() =>{
      res.sendStatus(httpStatus.OK);
    }).catch(next);
  }
}
