"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = __importDefault(require("../config/database"));
const connectDb = () => mongoose_1.default.connect(database_1.default.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
exports.connectDb = connectDb;
