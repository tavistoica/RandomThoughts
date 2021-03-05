"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const mikro_orm_1 = require("mikro-orm");
const type_graphql_1 = require("type-graphql");
const user_entity_1 = require("../entities/user.entity");
const bcryptjs_1 = require("bcryptjs");
const auth_1 = require("../auth/auth");
const sendRefreshToken_1 = require("../auth/sendRefreshToken");
let LoginResponse = class LoginResponse {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
__decorate([
    type_graphql_1.Field(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], LoginResponse.prototype, "user", void 0);
LoginResponse = __decorate([
    type_graphql_1.ObjectType()
], LoginResponse);
let UserResolver = class UserResolver {
    getUsers({ em }) {
        return em.find(user_entity_1.User, {}, { orderBy: { updatedAt: mikro_orm_1.QueryOrder.DESC } });
    }
    getUser(id, { em }) {
        return em.findOne(user_entity_1.User, { userID: id });
    }
    registerUser(username, password, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield em.findOne(user_entity_1.User, { username });
                if (user)
                    return false;
                const hashedPassword = yield bcryptjs_1.hash(password, 12);
                const userObject = em.create(user_entity_1.User, {
                    username,
                    password: hashedPassword,
                });
                yield em.persistAndFlush(userObject);
            }
            catch (error) {
                console.log(error);
                return false;
            }
            return true;
        });
    }
    loginUser(username, password, { em, res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(user_entity_1.User, { username });
            if (!user)
                throw new Error("could not find user");
            const valid = yield bcryptjs_1.compare(password, user.password);
            if (!valid)
                throw new Error("Password is incorrect");
            console.log("refresh token", auth_1.createRefreshToken(user));
            sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(user));
            return { accessToken: auth_1.createAccessToken(user), user };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [user_entity_1.User]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    type_graphql_1.Query(() => user_entity_1.User, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("username")),
    __param(1, type_graphql_1.Arg("password")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "registerUser", null);
__decorate([
    type_graphql_1.Mutation(() => LoginResponse),
    __param(0, type_graphql_1.Arg("username")),
    __param(1, type_graphql_1.Arg("password")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "loginUser", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
