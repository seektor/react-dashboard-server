import * as Sequelize from "sequelize";
import { db } from "../db";
import { UserModel, UserModelViewAttributes } from "./UserModel";

interface TokenModelAttributes {
  id: number;
  accessToken: string;
  userId: number;
}

type TokenModelCreationAttributes = Omit<TokenModelAttributes, "id">;

export type TokenModelViewAttributes = TokenModelCreationAttributes;

interface TokenModelInstance
  extends Sequelize.Model<TokenModelAttributes, TokenModelCreationAttributes>,
    TokenModelAttributes {
  user?: UserModelViewAttributes;
}

export const TokenModel = db.define<TokenModelInstance>("token", {
  id: {
    type: Sequelize.UUID,
    autoIncrement: true,
    primaryKey: true,
  },
  accessToken: {
    type: Sequelize.STRING,
    field: "access_token",
  },
  userId: {
    type: Sequelize.UUID,
    field: "user_id",
    references: {
      key: "id",
      model: UserModel,
    },
  },
});

TokenModel.belongsTo(UserModel, { foreignKey: "userId" });

export type TokenModelViewAttributesWithUser = TokenModelViewAttributes & {
  user: UserModelViewAttributes[];
};
