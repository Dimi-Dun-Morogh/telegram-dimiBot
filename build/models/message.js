"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    userName: {
        type: String,
    },
    chat_id: {
        type: Number,
    },
    user_id: {
        type: Number,
    },
    chat_title: {
        type: String,
    },
    text: {
        type: String,
    },
    date: {
        type: Number,
    },
    name: {
        type: String,
    },
});
exports.default = mongoose_1.default.model('Message', messageSchema);
