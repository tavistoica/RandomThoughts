import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string): void => {
  console.log("res", res);
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh-token",
  });
};
