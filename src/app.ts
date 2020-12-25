import cors from "cors";
import express from "express";
import { APP_CONFIG } from "./appConfig";
import { db } from "./db/db";
import errorMiddleware from "./middlewares/errorMiddleware";
import AuthRouter from "./routes/authRoutes";
import SalesAggregatesRouter from "./routes/salesAggregatesRoutes";
import SalesRouter from "./routes/salesRoutes";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.connectToDatabase();
    this.initBaseMiddlewares();
    this.initRouting();
    this.initErrorHandling();
  }

  public listen(): void {
    this.app.listen(APP_CONFIG.SERVER_PORT, () => {
      console.log(`Server Started at Port ${APP_CONFIG.SERVER_PORT}.`);
    });
  }

  private initBaseMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initRouting(): void {
    this.app.use("/api", AuthRouter);
    this.app.use("/api", SalesRouter);
    this.app.use("/api", SalesAggregatesRouter);
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
