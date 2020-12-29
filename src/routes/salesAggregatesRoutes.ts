import express, { NextFunction, Request, Response } from "express";
import sequelize from "sequelize";
import { RegionModel, RegionModelInstance } from "../db/models/RegionModel";
import {
  SaleModel,
  SaleModelColumnNameToAttributeMap,
} from "../db/models/SaleModel";
import authMiddleware from "../middlewares/authMiddleware";

const SalesAggregatesRouter = express.Router();

enum AllowedGroupByValues {
  Region = "region",
  ItemType = "item_type",
}

type SalesAttributesGetRequestQuery = { value: string; group_by: string };
type SalesAttributesGetRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
  SalesAttributesGetRequestQuery
>;
type AggregationData = { aggregator: unknown; value: unknown };
type SalesAggregatesGetResponse = Response<
  { data: AggregationData[] } & Record<string, unknown>
>;

SalesAggregatesRouter.get(
  "/salesAggregates",
  authMiddleware,
  async (
    req: SalesAttributesGetRequest,
    res: SalesAggregatesGetResponse,
    next: NextFunction
  ) => {
    try {
      const { group_by, value } = req.query;

      switch (group_by) {
        case AllowedGroupByValues.Region: {
          const data = await aggregateByRegion(value);
          res.status(200).send({ data });
          break;
        }
        case AllowedGroupByValues.ItemType: {
          const data = await aggregateByItemType(value);
          res.status(200).send({ data });
          break;
        }
        default:
          throw new Error(
            `'${group_by}' is not allowed value for group_by aggregation!`
          );
      }
    } catch (error) {
      next(error);
    }
  }
);

enum AllowedRegionAggregations {
  TotalProfit = "total_profit",
}
const aggregateByRegion = async (value: string) => {
  if (value !== AllowedRegionAggregations.TotalProfit) {
    throw new Error(
      `'${value}' is not an allowed value for aggregation by Region!`
    );
  }
  const data = ((await SaleModel.findAll({
    attributes: [
      [
        sequelize.cast(
          sequelize.fn(
            "sum",
            sequelize.col(SaleModelColumnNameToAttributeMap.totalProfit)
          ),
          "float"
        ),
        "totalProfit",
      ],
    ],
    include: [{ model: RegionModel }],
    group: ["region.id"],
    order: sequelize.literal('"totalProfit" ASC'),
  })) as unknown) as { totalProfit: number; region: RegionModelInstance }[];
  return data.map((result) => ({
    aggregator: result.region.region,
    value: result.totalProfit,
  }));
};

enum AllowedItemTypeAggregations {
  UnitsSold = "units_sold",
}
const aggregateByItemType = async (value: string) => {
  if (value !== AllowedItemTypeAggregations.UnitsSold) {
    throw new Error(
      `'${value}' is not an allowed value for aggregation by Item Type!`
    );
  }
  const data = ((await SaleModel.findAll({
    attributes: [
      [
        sequelize.cast(
          sequelize.fn(
            "sum",
            sequelize.col(SaleModelColumnNameToAttributeMap.unitsSold)
          ),
          "float"
        ),
        "unitsSold",
      ],
      [SaleModelColumnNameToAttributeMap.itemType, "itemType"],
    ],
    group: [SaleModelColumnNameToAttributeMap.itemType],
    order: sequelize.literal('"unitsSold" ASC'),
  })) as unknown) as { unitsSold: number; itemType: string }[];
  return data.map((result) => ({
    aggregator: result.itemType,
    value: result.unitsSold,
  }));
};

export default SalesAggregatesRouter;
