import express, { NextFunction, Request, Response } from "express";
import { CountryModel, CountryModelInstance } from "../db/models/CountryModel";
import { RegionModel, RegionModelInstance } from "../db/models/RegionModel";
import {
  SaleModel,
  SaleModelAttributes,
  SaleModelInstance,
} from "../db/models/SaleModel";
import { DataWithPagination } from "../types/DataWithPagination";

const SalesRouter = express.Router();

type SalesQueryResult = SaleModelInstance & {
  region: RegionModelInstance;
  country: CountryModelInstance;
};
type SalesViewAttributes = Omit<
  SaleModelAttributes,
  "regionId" | "countryId"
> & {
  region: string;
  country: string;
};

type SalesGetRequestQuery = { pageIndex: string; pageSize: string };
type SalesGetRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  Record<string, unknown>,
  SalesGetRequestQuery
>;
type SalesGetResponse = Response<
  DataWithPagination<SalesViewAttributes[]> & { [key: string]: unknown }
>;

SalesRouter.get(
  "/sales",
  // authMiddleware,
  async (req: SalesGetRequest, res: SalesGetResponse, next: NextFunction) => {
    try {
      const pageIndex = parseInt(req.query.pageIndex) || 0;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const salesData = ((await SaleModel.findAll({
        offset: pageIndex * pageSize,
        limit: pageSize,
        include: [{ model: RegionModel }, { model: CountryModel }],
      })) as unknown) as SalesQueryResult[];

      const salesDataView: SalesViewAttributes[] = salesData.map((data) => ({
        id: data.id,
        country: data.country.country,
        region: data.region.region,
        itemType: data.itemType,
        salesChannel: data.salesChannel,
        orderPriority: data.orderPriority,
        orderDate: data.orderDate,
        shipDate: data.shipDate,
        unitsSold: data.unitsSold,
        unitPrice: data.unitPrice,
        unitCost: data.unitCost,
        totalRevenue: data.totalRevenue,
        totalCost: data.totalCost,
        totalProfit: data.totalProfit,
      }));

      const salesCount = await SaleModel.count();
      res.status(200).send({
        data: salesDataView,
        pagination: {
          pageCount: Math.ceil(salesCount / pageSize),
          pageIndex,
          pageSize,
        },
      });
    } catch (e) {
      next(e);
    }
  }
);

export default SalesRouter;
