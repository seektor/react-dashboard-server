import * as Sequelize from "sequelize";
import { db } from "../db";

interface UserModelAttributes {
  id: string;
  userName: string;
  password: string;
}

type UserModelCreationAttributes = Omit<UserModelAttributes, "id">;

export type UserModelViewAttributes = Omit<UserModelAttributes, "password">;

interface UserModelInstance
  extends Sequelize.Model<UserModelAttributes, UserModelCreationAttributes>,
    UserModelAttributes {}

export const UserModel = db.define<UserModelInstance>("user", {
  id: {
    type: Sequelize.UUID,
    autoIncrement: true,
    primaryKey: true,
  },
  userName: {
    type: Sequelize.STRING,
    field: "user_name",
  },
  password: Sequelize.STRING,
});
