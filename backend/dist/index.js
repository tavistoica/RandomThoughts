"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const thought_resolver_1 = require("./resolvers/thought.resolver");
const cors_1 = __importDefault(require("cors"));
const user_resolver_1 = require("./resolvers/user.resolver");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = require("jsonwebtoken");
const user_entity_1 = require("./entities/user.entity");
const auth_1 = require("./auth/auth");
const sendRefreshToken_1 = require("./auth/sendRefreshToken");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
    yield orm.getMigrator().up();
    const app = express_1.default();
    app.use(cors_1.default());
    app.use(cookie_parser_1.default());
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [thought_resolver_1.ThoughtResolver, user_resolver_1.UserResolver],
            validate: false,
        }),
        context: ({ req, res }) => ({
            em: orm.em,
            req,
            res,
        }),
    });
    apolloServer.applyMiddleware({ app });
    app.post("/refresh-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.cookies.jid;
        let payload = null;
        if (!token)
            return res.send({ success: false, accessToken: "" });
        try {
            payload = jsonwebtoken_1.verify(token, process.env.REFRESH_TOKEN_SECRET);
        }
        catch (error) {
            console.log(error);
            return res.send({ success: false, accessToken: "" });
        }
        const user = yield orm.em.findOne(user_entity_1.User, { userID: payload.userID });
        if (!user)
            return res.send({ success: false, accessToken: "" });
        if (user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, accessToken: "" });
        }
        //  refresh the refresh-token once we refresh the auth token
        sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(user));
        return res.send({ success: true, accessToken: auth_1.createAccessToken(user) });
    }));
    app.listen(8080, () => {
        console.log("Server started on port 8080");
    });
});
main().catch((err) => {
    console.error(err);
});
