import { NextFunction, Response } from "express";
import HttpException from "../exceptions/HttpException";

const errorMiddleware = (
  error: HttpException,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Unhandled error";
  console.error("ERROR: ", message);
  response.status(statusCode).send({
    statusCode,
    message,
  });
};

export default errorMiddleware;
