import cors from "cors";
import express from "express";
import { db } from "./db/db";
import errorMiddleware from "./middlewares/errorMiddleware";
import AuthRouter from "./routes/authRoutes";
import SalesRouter from "./routes/salesRoutes";
import { APP_CONFIG } from "./types/appConfig";

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
