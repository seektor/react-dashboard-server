import * as Sequelize from "sequelize";
import { db } from "../db";
import { CountryModel } from "./CountryModel";
import { RegionModel } from "./RegionModel";

export interface SaleModelAttributes {
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

export interface SaleModelInstance
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
  itemType: {
    type: Sequelize.STRING,
    field: "item_type",
  },
  salesChannel: {
    type: Sequelize.ENUM("Online", "Offline"),
    field: "sales_channel",
  },
  orderPriority: {
    type: Sequelize.ENUM("L", "C", "H", "M"),
    field: "order_priority",
  },
  orderDate: {
    type: Sequelize.DATE,
    field: "order_date",
  },
  shipDate: {
    type: Sequelize.DATE,
    field: "ship_date",
  },
  unitsSold: {
    type: Sequelize.NUMBER,
    field: "units_sold",
  },
  unitPrice: {
    type: Sequelize.NUMBER,
    field: "unit_price",
  },
  unitCost: {
    type: Sequelize.NUMBER,
    field: "unit_cost",
  },
  totalRevenue: {
    type: Sequelize.NUMBER,
    field: "total_revenue",
  },
  totalCost: {
    type: Sequelize.NUMBER,
    field: "total_cost",
  },
  totalProfit: {
    type: Sequelize.NUMBER,
    field: "total_profit",
  },
});

SaleModel.belongsTo(RegionModel, { foreignKey: "regionId" });
SaleModel.belongsTo(CountryModel, { foreignKey: "countryId" });
