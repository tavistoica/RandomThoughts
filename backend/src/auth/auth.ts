import { sign } from "jsonwebtoken";
import { User } from "../entities/user.entity";

export const createAccessToken = (user: User) => {
  return sign({ userId: user.userID }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1m",
  });
};

export const createRefreshToken = (user: User) => {
  return sign(
    { userID: user.userID, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};
