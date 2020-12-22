import dotenv, { DotenvConfigOutput } from "dotenv";

interface AppConfig {
  SERVER_PORT: string;

  POSTGRES_DATABASE: string;
  POSTGRES_PORT: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;

  JWT_SECRET: string;
}

const processedConfig: DotenvConfigOutput = dotenv.config();

if (processedConfig.error && !processedConfig.parsed) {
  throw new Error("There was an error during environmental variables parsing!");
}

export const APP_CONFIG = (dotenv.config().parsed as unknown) as AppConfig;
