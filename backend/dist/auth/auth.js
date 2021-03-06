"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createAccessToken = (user) => {
    return jsonwebtoken_1.sign({ userId: user.userID }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1m",
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (user) => {
    return jsonwebtoken_1.sign({ userID: user.userID, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};
exports.createRefreshToken = createRefreshToken;
