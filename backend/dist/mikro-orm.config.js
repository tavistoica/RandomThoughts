"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const thought_entity_1 = require("./entities/thought.entity");
const path_1 = __importDefault(require("path"));
const user_entity_1 = require("./entities/user.entity");
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    dbName: "firstproject6",
    type: "postgresql",
    debug: !constants_1.__prod__,
    password: "blender",
    entities: [thought_entity_1.thought, user_entity_1.User],
};
