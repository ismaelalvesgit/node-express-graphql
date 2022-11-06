import { Container } from "@type/core";
import { IHttpRoute } from "@type/interface";
import express from "express";
import { Logger } from "@util/logger";
import { SystemController } from "./v1/system";

type Config = {
    coreContainer: Container;
    app?: express.Application
};

export class HttpRouter {
    private app?: Config["app"];
    private coreContainer: Config["coreContainer"];

    constructor(config: Config) {
        this.coreContainer = config.coreContainer;
        this.app = config.app;
    }

    // eslint-disable-next-line class-methods-use-this
    private _debug(info: object = {}, msg: string = "") {
        Logger.debug({
        class: "HttpRouter",
        classType: "Router",
        ...info,
        }, msg);
    }

    v1() {
        [
            new SystemController({
                coreContainer: this.coreContainer,
            })
        ].forEach((route: IHttpRoute) => {
            const router = express.Router({ mergeParams: true });
            route.register(router);
            this.app?.use("/v1", router);
        });
        this._debug({}, "Setup v1 sucess");
    }
}