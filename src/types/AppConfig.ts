import { DotenvConfigOptions } from "dotenv/types";

export interface AppConfig extends DotenvConfigOptions {
  SERVER_PORT: string;
}
