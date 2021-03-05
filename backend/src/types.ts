import { EntityManager, IDatabaseDriver, Connection } from "mikro-orm";
import { Request, Response } from "express";

export type MyContext = {
  req: Request;
  res: Response;
  payload?: { userID: string };
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
