import bcrypt from "bcryptjs";
import express, { NextFunction, Request, Response } from "express";
import { TokenModel } from "../db/models/TokenModel";
import { UserModel, UserModelViewAttributes } from "../db/models/UserModel";
import HttpException from "../exceptions/HttpException";
import authMiddleware from "../middlewares/authMiddleware";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { generateAuthToken, validateUser } from "../utils/auth.utils";

const AuthRouter = express.Router();

type RegisterRequestBody = { userName: string; password: string };
type RegisterRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  RegisterRequestBody
>;

AuthRouter.post(
  "/register",
  async (req: RegisterRequest, res: Response, next: NextFunction) => {
    try {
      const { userName, password } = req.body;
      if (!userName || !password) {
        throw new HttpException(400, "UserName and Password cannot be empty!");
      }

      const duplicates = await UserModel.findAll({ where: { userName } });
      if (duplicates.length > 0) {
        throw new HttpException(400, "User with this name already exists!");
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      await UserModel.create({ password: hashedPassword, userName: userName });
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
);

type LoginRequestBody = { userName: string; password: string };
type LoginRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  LoginRequestBody
>;
type LoginResponse = Response<{
  userName: string;
  accessToken: string;
}>;

AuthRouter.post(
  "/login",
  async (req: LoginRequest, res: LoginResponse, next: NextFunction) => {
    try {
      const { userName, password } = req.body;
      if (!userName || !password) {
        throw new HttpException(400, "UserName and Password cannot be empty!");
      }

      let user: UserModelViewAttributes;
      try {
        user = await validateUser(userName, password);
      } catch (e) {
        throw new HttpException(400, e.message);
      }

      let tokenInstance;
      const existingToken = await TokenModel.findOne({
        where: { userId: user.id },
      });
      if (existingToken) {
        tokenInstance = existingToken;
      } else {
        const token = await generateAuthToken(user);
        tokenInstance = await TokenModel.create({
          accessToken: token,
          userId: user.id,
        });
      }

      const accessToken = tokenInstance.accessToken;
      res
        .status(200)
        .send({ accessToken: accessToken, userName: user.userName });
    } catch (error) {
      next(error);
    }
  }
);

AuthRouter.post(
  "/logout",
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { accessToken, user } = req.body;
      await TokenModel.destroy({
        where: {
          userId: user.id,
          accessToken,
        },
      });
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

export default AuthRouter;
