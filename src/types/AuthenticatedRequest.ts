import { Request } from "express";
import { UserModelViewAttributes } from "../db/models/UserModel";

export type AuthenticatedRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  { user: UserModelViewAttributes; accessToken: string }
>;
