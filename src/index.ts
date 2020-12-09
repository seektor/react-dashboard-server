import cors from "cors";
import express from "express";
import { APP_CONFIG } from "./appConfig";
import { db } from "./db/db";
import { UserModel } from "./db/models/UserModel";
import AuthRouter from "./routes/authRoutes";

const app = express();

app.use(express.json());
app.use(cors());

app.use(AuthRouter);

app.listen(APP_CONFIG.SERVER_PORT, () => {
  console.log(`Server Started at Port ${APP_CONFIG.SERVER_PORT}.`);
});

db.authenticate()
  .then(async () => {
    console.log(`Database is listening at Port ${APP_CONFIG.POSTGRES_PORT}.`);

    const users = await UserModel.findAll();
  })
  .catch(() => console.log("Error initializing db connection."));
