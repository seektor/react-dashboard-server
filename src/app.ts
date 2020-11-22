import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { AppConfig } from "./types/AppConfig";

const app = express();
const CONFIG = dotenv.config() as AppConfig;

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!");
});

app.listen(CONFIG.SERVER_PORT, () => {
  console.log("Server Started at Port, 800");
});
