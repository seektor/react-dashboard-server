import express, { NextFunction, Request, Response } from "express";
import { SaleModel } from "../db/models/SaleModel";
import authMiddleware from "../middlewares/authMiddleware";

const SalesMetadataRouter = express.Router();

type SalesMetadata = {
  salesCount: number;
};

type SalesGetResponse = Response<SalesMetadata & Record<string, unknown>>;

SalesMetadataRouter.get(
  "/salesMetadata",
  authMiddleware,
  async (req: Request, res: SalesGetResponse, next: NextFunction) => {
    try {
      const salesCount = await SaleModel.count();
      res.status(200).send({
        salesCount,
      });
    } catch (e) {
      next(e);
    }
  }
);

export default SalesMetadataRouter;
