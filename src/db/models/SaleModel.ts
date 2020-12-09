import * as Sequelize from "sequelize";
import { db } from "../db";
import { CountryModel } from "./CountryModel";
import { RegionModel } from "./RegionModel";

interface SaleModelAttributes {
  id: number;
  regionId: number;
  countryId: number;
  itemType: string;
  salesChannel: string;
  orderPriority: string;
  orderDate: string;
  shipDate: string;
  unitsSold: number;
  unitPrice: number;
  unitCost: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}

type SaleModelCreationAttributes = Omit<SaleModelAttributes, "id">;

export type SaleModelViewAttributes = SaleModelAttributes;

interface SaleModelInstance
  extends Sequelize.Model<SaleModelAttributes, SaleModelCreationAttributes>,
  SaleModelAttributes {}

export const SaleModel = db.define<SaleModelInstance>("sale", {
  id: {
    type: Sequelize.UUID,
    autoIncrement: true,
    primaryKey: true,
  },
  regionId: {
    type: Sequelize.UUID,
    field: "region_id",
    references: {
      key: "id",
      model: RegionModel,
    },
  },
  countryId: {
    type: Sequelize.UUID,
    field: "country_id",
    references: {
      key: "id",
      model: CountryModel,
    },
  },
  itemType: Sequelize.STRING,
  salesChannel: Sequelize.STRING,
  orderPriority: Sequelize.CHAR,
  orderDate: Sequelize.STRING,
  shipDate: Sequelize.STRING,
  unitsSold: Sequelize.NUMBER,
  unitPrice: Sequelize.NUMBER,
  unitCost: Sequelize.NUMBER,
  totalRevenue: Sequelize.NUMBER,
  totalCost: Sequelize.NUMBER,
  totalProfit: Sequelize.NUMBER,
});

// ToastModel.belongsTo(UserModel, { foreignKey: "userId" });

// export type ToastModelViewAttributesWithUser = ToastModelViewAttributes & {
//   user: UserModelViewAttributes[];
// };
