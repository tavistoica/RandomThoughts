import { __prod__ } from "./constants";
import { thought } from "./entities/thought.entity";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/user.entity";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  dbName: process.env.DB_NAME,
  type: "postgresql",
  debug: !__prod__,
  password: process.env.DB_PASSWORD,
  entities: [thought, User],
} as Parameters<typeof MikroORM.init>[0];
