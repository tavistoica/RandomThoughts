import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { ThoughtResolver } from "./resolvers/thought.resolver";
import cors from "cors";
import { UserResolver } from "./resolvers/user.resolver";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entities/user.entity";
import { createAccessToken, createRefreshToken } from "./auth/auth";
import { sendRefreshToken } from "./auth/sendRefreshToken";

(async () => {
  const app = express();
  const corsOptions = {
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));
  app.use(cookieParser());
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ThoughtResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({
      em: orm.em,
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: corsOptions });

  // app.use(cors(corsOptions));
  app.post("/refresh-token", async (req, res) => {
    const token = req.cookies.jid;
    let payload: any = null;
    if (!token) return res.send({ success: false, accessToken: "" });

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error) {
      console.log(error);
      return res.send({ success: false, accessToken: "" });
    }
    const user = await orm.em.findOne(User, { userID: payload.userID });
    if (!user) return res.send({ success: false, accessToken: "" });

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    //  refresh the refresh-token once we refresh the auth token
    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ success: true, accessToken: createAccessToken(user) });
  });

  app.listen(8080, () => {
    console.log("Server started on port 8080");
  });
})();

// };

// main().catch((err) => {
//   console.error(err);
// });
