import { ApolloServer, } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import helmet, { hsts } from "helmet";
import cors from "cors";
import express from "express";
import xssFilter from "x-xss-protection";
import responseTime from "response-time";
import http from "http";
import hidePoweredBy from "hide-powered-by";
import { Container } from "@type/core";
import { IHttpInterface } from "@type/interface";
import { ExpressLogger, Logger } from "@util/logger";
import { IContext } from "@type/interface";
import generateSchemas from "./graphql/helpers/generateSchemas";
import resolvers from "./graphql/resolvers";
import changeLocaleHandler from "@middleware/changeLocale";
import i18n from "@middleware/i18n";
import requestIdHandler from "@middleware/requestId";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { HttpRouter } from "@controller/routes";

type Config = {
  env: typeof import("@util/env").env;
  coreContainer: Container;
};

export class HttpInterface implements IHttpInterface {
  private app: express.Express;
  private httpServer: http.Server;
  private coreContainer: Config["coreContainer"];
  private env: Config["env"];

  constructor(config: Config) {
    Logger.debug({
      coreContainer: config.coreContainer !== undefined,
      env: config.env !== undefined,
    }, "fun: HttpInterface.constructor");

    this.coreContainer = config.coreContainer;
    this.env = config.env;
    this.app = express();
    this.httpServer = http.createServer(this.app); 
  }

  // eslint-disable-next-line class-methods-use-this
  private _debug(info: object = {}, msg: string = "") {
    Logger.debug({
      class: "HttpInterface",
      classType: "Interface",
      ...info,
    }, msg);
  }

  private async initApp() {
    this.app.use(
      helmet({
        contentSecurityPolicy: this.env.isProd,
      }),
      cors(),
      express.json({limit: this.env.server.bodyLimit}),
      express.urlencoded({extended: true}),
      hsts({
        maxAge: 31536000,
        includeSubDomains: true, 
        preload: true
      }),
      xssFilter(),
      hidePoweredBy(),
      requestIdHandler,
      i18n.init,
      changeLocaleHandler,
      responseTime(),
    );

    this.setupEngineView();
    
    this.setupAssets();

    // this.app.use(ExpressLogger.onSuccess.bind(ExpressLogger));
    this.app.use(ExpressLogger.onError.bind(ExpressLogger));

    this.setupRoutes();
    
    await this.startApolloServer();

    this.setupNotFound();
  }

  setupRoutes() {
    const router = new HttpRouter({
      app: this.app,
      coreContainer: this.coreContainer
    });
    router.v1();
    
    this.app?.get("/", (req, res)=>{
      res.render("index", {url: this.env.server.url});
    });
    this._debug({}, "setupRoutes end");
  }

  private setupNotFound() {
    this.app.all(
      "*",
      (req: express.Request, res: express.Response ) => {
        res.json({message: req.__("ServiceUnavailable.router")}).status(501);
      },
    );
  }

  private setupAssets(){  
    this.app.use("/static", express.static("./src/public"));
  }

  private setupEngineView(){
    this.app.set("view engine", "ejs");
    this.app.set("views", "./src/views");
  }

  
  private async startApolloServer(){
    const path = "/v1/graphql";
    const typeDefs = generateSchemas();
    const wsServer = new WebSocketServer({
      server: this.httpServer,
      path,
    });
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const serverCleanup = useServer({ schema }, wsServer);

    const server = new ApolloServer<IContext>({
      schema,
      plugins: [ApolloServerPluginDrainHttpServer({httpServer: this.httpServer}), 
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        }
      ]
    });

    await server.start();

    this.app.use(path,
      cors<cors.CorsRequest>(),
      express.json(),
      expressMiddleware(server, {context: async ({req}) => {
        return {
          coreContainer: this.coreContainer,
          requestId: req.requestId,
          i18n: req.__
        };
      }})
    );
  }

  async serve() {
    await this.initApp();

    this.httpServer.listen(this.env.server.port);

    this._debug({}, "http interface initialized");
  }
}
