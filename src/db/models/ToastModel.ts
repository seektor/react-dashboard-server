import * as Sequelize from "sequelize";
import { db } from "../db";
import { UserModel, UserModelViewAttributes } from "./UserModel";

interface ToastModelAttributes {
  id: number;
  userId: number;
  title: string;
  description: string;
}

type ToastModelCreationAttributes = Omit<ToastModelAttributes, "id">;

export type ToastModelViewAttributes = Omit<ToastModelAttributes, "userId">;

interface ToastModelInstance
  extends Sequelize.Model<ToastModelAttributes, ToastModelCreationAttributes>,
    ToastModelAttributes {
  user?: UserModelViewAttributes;
}

export const ToastModel = db.define<ToastModelInstance>("toast", {
  id: {
    type: Sequelize.UUID,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.UUID,
    field: "user_id",
    references: {
      key: "id",
      model: UserModel,
    },
  },
  title: {
    type: Sequelize.STRING,
    field: "title",
  },
  description: {
    type: Sequelize.STRING,
    field: "description",
  },
});

ToastModel.belongsTo(UserModel, { foreignKey: "userId" });
