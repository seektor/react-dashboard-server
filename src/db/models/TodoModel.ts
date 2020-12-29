import * as Sequelize from "sequelize";
import { db } from "../db";
import { UserModel, UserModelViewAttributes } from "./UserModel";

interface TodoModelAttributes {
  id: number;
  userId: number;
  title: string;
  description: string;
}

type TodoModelCreationAttributes = Omit<TodoModelAttributes, "id">;

interface ToastModelInstance
  extends Sequelize.Model<TodoModelAttributes, TodoModelCreationAttributes>,
    TodoModelAttributes {
  user?: UserModelViewAttributes;
}

export const TodoModel = db.define<ToastModelInstance>("todo", {
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

TodoModel.belongsTo(UserModel, { foreignKey: "userId" });
