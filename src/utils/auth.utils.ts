import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel, UserModelViewAttributes } from "../db/models/UserModel";
import { APP_CONFIG } from "../types/appConfig";

export const validateUser = async (
  userName: string,
  password: string
): Promise<UserModelViewAttributes> => {
  const user = await UserModel.findOne({
    where: { userName },
  });

  if (!user) {
    throw new Error("User does not exist.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("The password does not match.");
  }
  const userView: UserModelViewAttributes = {
    id: user.id,
    userName: user.userName,
  };
  return userView;
};

export const generateAuthToken = async (
  user: UserModelViewAttributes
): Promise<string> => {
  const secret = APP_CONFIG.JWT_SECRET;
  const token = await jwt.sign(user, secret);
  return token;
};
