import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { APP_CONFIG } from "../appConfig";
import { TokenModel } from "../db/models/TokenModel";
import { UserModel } from "../db/models/UserModel";
import HttpException from "../exceptions/HttpException";
import { JWTPayload } from "../types/JWTPayload";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new HttpException(401, "Missing Authorization header!");
    }
    const token = authorizationHeader;
    const decoded = (jwt.verify(
      token,
      APP_CONFIG.JWT_SECRET
    ) as unknown) as JWTPayload;

    const dbTokenEntry = await TokenModel.findOne({
      where: { accessToken: token, userId: decoded.id },
      include: [UserModel],
    });
    if (!dbTokenEntry) {
      throw new HttpException(401, "User not authenticated!");
    }

    const user = dbTokenEntry.user;
    if (!user) {
      throw new HttpException(401, "No user associated with the token!");
    }
    req.body.user = user;
    req.body.accessToken = token;
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
