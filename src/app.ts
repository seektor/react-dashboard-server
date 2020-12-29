import cors from "cors";
import express from "express";
import { Server as HttpServer } from "http";
import { APP_CONFIG } from "./appConfig";
import { db } from "./db/db";
import errorMiddleware from "./middlewares/errorMiddleware";
import AuthRouter from "./routes/authRoutes";
import SalesAggregatesRouter from "./routes/salesAggregatesRoutes";
import SalesMetadataRouter from "./routes/salesMetadataRoutes";
import SalesRouter from "./routes/salesRoutes";
import TodosRouter from "./routes/todosRoutes";
import SocketsService from "./services/Sockets.service";

class App {
  private app: express.Application;
  private server!: HttpServer;
  private socketsService!: SocketsService;

  constructor() {
    this.app = express();

    this.connectToDatabase();
    this.initBaseMiddlewares();
    this.initRouting();
    this.initErrorHandling();
  }

  public listen(): void {
    if (this.server) {
      return;
    }
    this.server = this.app.listen(APP_CONFIG.SERVER_PORT, () => {
      console.log(`Server Started at Port ${APP_CONFIG.SERVER_PORT}.`);
    });
    this.initSocketsService();
  }

  private initBaseMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initRouting(): void {
    this.app.use("/api", AuthRouter);
    this.app.use("/api", SalesRouter);
    this.app.use("/api", SalesAggregatesRouter);
    this.app.use("/api", SalesMetadataRouter);
    this.app.use("/api", TodosRouter);
  }

  private initSocketsService(): void {
    this.socketsService = SocketsService.init(this.server);
  }

  private initErrorHandling(): void {
    this.app.use(errorMiddleware as never);
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await db.authenticate();
      console.log(`Database is listening at Port ${APP_CONFIG.POSTGRES_PORT}.`);
    } catch {
      console.log("Error initializing db connection.");
    }
  }
}

export default App;
