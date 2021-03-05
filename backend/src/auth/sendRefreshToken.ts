import { Response } from "express";

export const sendRefreshToken = (res: Response, token: string) => {
  console.log("res", res);
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh-token",
  });
};
