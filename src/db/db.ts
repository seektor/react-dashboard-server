import { Sequelize } from "sequelize";
import { APP_CONFIG } from "../types/appConfig";

export const db = new Sequelize(APP_CONFIG.POSTGRES_DATABASE, {
  username: APP_CONFIG.POSTGRES_USER,
  password: APP_CONFIG.POSTGRES_PASSWORD,
  dialect: "postgres",
  define: {
    timestamps: false,
  },
  port: parseInt(APP_CONFIG.POSTGRES_PORT),
});
