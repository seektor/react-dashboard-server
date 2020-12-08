import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { APP_CONFIG } from "../appConfig";
import { TokenModel } from "../db/models/TokenModel";
import { UserModel } from "../db/models/UserModel";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { JWTPayload } from "../types/JWTPayload";

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new Error("Missing Authorization header.");
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
      throw new Error("User not authenticated.");
    }

    const user = dbTokenEntry.user;

    if (!user) {
      throw new Error("No user associated with the token.");
    }
    req.body.user = user;
    req.body.accessToken = token;
    next();
  } catch (error) {
    res.status(400).send({
      auth_error: error.message,
    });
  }
};
