"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const isAuth = ({ context }, next) => {
    const authorization = context.req.headers["authorization"];
    if (!authorization)
        throw new Error("Not Authenticated");
    try {
        const token = authorization.split(" ")[1];
        const payload = jsonwebtoken_1.verify(token, process.env.ACCESS_TOKEN_SECRET);
        context.payload = payload;
    }
    catch (error) {
        console.log(error);
        throw new Error("Not Authenticated");
    }
    return next();
};
exports.isAuth = isAuth;
