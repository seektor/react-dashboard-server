import bcrypt from "bcryptjs";
import express, { Request, Response } from "express";
import { TokenModel } from "../db/models/TokenModel";
import { UserModel, UserModelViewAttributes } from "../db/models/UserModel";
import authMiddleware from "../middlewares/authMiddleware";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { generateAuthToken, validateUser } from "../utils/auth.utils";

const AuthRouter = express.Router();

type RegisterRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  { userName?: string; password?: string }
>;
type RegisterResponse = Response<{ registerError?: string }>;

AuthRouter.post(
  "/register",
  async (req: RegisterRequest, res: RegisterResponse) => {
    try {
      const { userName, password } = req.body;
      if (!userName || !password) {
        throw new Error("Invalid field.");
      }

      const duplicates = await UserModel.findAll({ where: { userName } });
      if (duplicates.length > 0) {
        throw new Error("User with this name already exists.");
      }

      const hashedPassword = await bcrypt.hash(password, 8);
      await UserModel.create({ password: hashedPassword, userName: userName });
      return res.status(201).send();
    } catch (e) {
      return res.status(400).send({
        registerError:
          e.message || "Error while registering... Try again later.",
      });
    }
  }
);

type LoginRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  { userName?: string; password?: string }
>;
type LoginResponse = Response<{
  userName?: string;
  accessToken?: string;
  loginError?: string;
}>;

AuthRouter.post("/login", async (req: LoginRequest, res: LoginResponse) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).send({
        loginError: "Invalid field.",
      });
    }

    let user: UserModelViewAttributes;
    try {
      user = await validateUser(userName, password);
    } catch (e) {
      return res.status(400).send({
        loginError: e.message,
      });
    }

    const token = await generateAuthToken(user);
    const tokenInstance = await TokenModel.create({
      accessToken: token,
      userId: user.id,
    });
    const accessToken = tokenInstance.accessToken;
    res.status(200).send({ accessToken: accessToken, userName: user.userName });
  } catch {
    return res.status(400).send({
      loginError: "Error while logging in... Try again later.",
    });
  }
});

type LogoutResponse = Response<{ logoutError?: string }>;

AuthRouter.post(
  "/logout",
  authMiddleware,
  async (req: AuthenticatedRequest, res: LogoutResponse) => {
    try {
      const { accessToken, user } = req.body;
      await TokenModel.destroy({
        where: {
          userId: user.id,
          accessToken,
        },
      });
      res.send();
    } catch {
      return res.status(400).send({
        logoutError: "Error while logging out... Try again later.",
      });
    }
  }
);

export default AuthRouter;
