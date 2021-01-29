"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const chatSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    chat_id: {
        type: Number,
    },
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },
    ],
    rules: {
        type: String,
        default: '',
    },
});
exports.default = mongoose_1.default.model('chat', chatSchema);
