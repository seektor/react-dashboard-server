import express, { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { PaginationData } from "../types/PaginationData";

const SalesRouter = express.Router();

type SalesGetRequestParams = Pick<PaginationData, "pageIndex" | "pageSize">;

type SalesGetRequest = Request<
  SalesGetRequestParams,
  undefined,
  Record<string, unknown>
> &
  AuthenticatedRequest;
type SalesGetResponse = Response<{} & { error?: string }>;

SalesRouter.get(
  "/sales",
  // authMiddleware,
  (req, res, next) => {
    console.log(res);
    throw new Error("Error bro");
  }
);

export default SalesRouter;
