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

export const SaleModelColumnNameToAttributeMap: {
  [key in keyof SaleModelAttributes]: string;
} = {
  countryId: "country_id",
  id: "id",
  itemType: "item_type",
  orderDate: "order_date",
  orderPriority: "order_priority",
  regionId: "region_id",
  salesChannel: "sales_channel",
  shipDate: "ship_date",
  totalCost: "total_cost",
  totalProfit: "total_profit",
  totalRevenue: "total_revenue",
  unitCost: "unit_cost",
  unitPrice: "unit_price",
  unitsSold: "units_sold",
};

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
    field: SaleModelColumnNameToAttributeMap.regionId,
    references: {
      key: "id",
      model: RegionModel,
    },
  },
  countryId: {
    type: Sequelize.UUID,
    field: SaleModelColumnNameToAttributeMap.countryId,
    references: {
      key: "id",
      model: CountryModel,
    },
  },
  itemType: {
    type: Sequelize.STRING,
    field: SaleModelColumnNameToAttributeMap.itemType,
  },
  salesChannel: {
    type: Sequelize.ENUM("Online", "Offline"),
    field: SaleModelColumnNameToAttributeMap.salesChannel,
  },
  orderPriority: {
    type: Sequelize.ENUM("L", "C", "H", "M"),
    field: SaleModelColumnNameToAttributeMap.orderPriority,
  },
  orderDate: {
    type: Sequelize.DATE,
    field: SaleModelColumnNameToAttributeMap.orderDate,
  },
  shipDate: {
    type: Sequelize.DATE,
    field: SaleModelColumnNameToAttributeMap.shipDate,
  },
  unitsSold: {
    type: Sequelize.NUMBER,
    field: SaleModelColumnNameToAttributeMap.unitsSold,
  },
  unitPrice: {
    type: Sequelize.NUMBER,
    field: SaleModelColumnNameToAttributeMap.unitPrice,
  },
  unitCost: {
    type: Sequelize.NUMBER,
    field: SaleModelColumnNameToAttributeMap.unitCost,
  },
  totalRevenue: {
    type: Sequelize.NUMBER,
    field: SaleModelColumnNameToAttributeMap.totalRevenue,
  },
  totalCost: {
    type: Sequelize.NUMBER,
    field: SaleModelColumnNameToAttributeMap.totalCost,
  },
  totalProfit: {
    type: Sequelize.NUMBER,
    field: SaleModelColumnNameToAttributeMap.totalProfit,
  },
});

SaleModel.belongsTo(RegionModel, { foreignKey: "regionId" });
SaleModel.belongsTo(CountryModel, { foreignKey: "countryId" });
