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
exports.ThoughtResolver = void 0;
const mikro_orm_1 = require("mikro-orm");
const type_graphql_1 = require("type-graphql");
const isAuth_1 = require("../auth/isAuth");
const thought_entity_1 = require("../entities/thought.entity");
let ThoughtResolver = class ThoughtResolver {
    getThoughts({ em }) {
        return em.find(thought_entity_1.thought, {}, { orderBy: { updatedAt: mikro_orm_1.QueryOrder.DESC } });
    }
    getThought(id, { em }) {
        return em.findOne(thought_entity_1.thought, { id });
    }
    setThought(thoughtContent, userID, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const thoughtObject = em.create(thought_entity_1.thought, {
                thought: thoughtContent,
                userID,
            });
            yield em.persistAndFlush(thoughtObject);
            return thoughtObject;
        });
    }
    addLike(id, userID, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const thoughtObject = yield em.findOne(thought_entity_1.thought, { id });
            if (!thoughtObject)
                return null;
            console.log(thoughtObject.likes.includes(userID));
            if (thoughtObject.likes.includes(userID)) {
                const index = thoughtObject.likes.findIndex((item) => item === userID);
                console.log(index);
                thoughtObject.likes.splice(index, 1);
                console.log(thoughtObject);
            }
            else {
                thoughtObject.likes.push(userID);
            }
            yield em.persistAndFlush(thoughtObject);
            return thoughtObject;
        });
    }
    updateThought(id, thoughtContent, { em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const thoughtObject = yield em.findOne(thought_entity_1.thought, { id });
            if (!thoughtObject)
                return null;
            if (thoughtContent)
                thoughtObject.thought = thoughtContent;
            yield em.persistAndFlush(thoughtObject);
            return thoughtObject;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [thought_entity_1.thought]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ThoughtResolver.prototype, "getThoughts", null);
__decorate([
    type_graphql_1.Query(() => thought_entity_1.thought, { nullable: true }),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ThoughtResolver.prototype, "getThought", null);
__decorate([
    type_graphql_1.Mutation(() => thought_entity_1.thought),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("thoughtContent")),
    __param(1, type_graphql_1.Arg("userID")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], ThoughtResolver.prototype, "setThought", null);
__decorate([
    type_graphql_1.Mutation(() => thought_entity_1.thought, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("userID")),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ThoughtResolver.prototype, "addLike", null);
__decorate([
    type_graphql_1.Mutation(() => thought_entity_1.thought, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("thoughtContent", () => String, { nullable: true })),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], ThoughtResolver.prototype, "updateThought", null);
ThoughtResolver = __decorate([
    type_graphql_1.Resolver()
], ThoughtResolver);
exports.ThoughtResolver = ThoughtResolver;
