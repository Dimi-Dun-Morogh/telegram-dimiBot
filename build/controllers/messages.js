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
const message_1 = __importDefault(require("../models/message"));
const loggers_1 = __importDefault(require("../helpers/loggers"));
const { createItem } = require('../db/db.crud');
const NAMESPACE = 'controllers/messages';
const createMessage = (messageObj) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from: { username: userName, first_name, last_name, id: user_id }, chat: { id: chat_id, title: chat_title }, date, text, } = messageObj;
        if (text === undefined || !text)
            return;
        const newMsg = yield createItem(message_1.default, {
            userName,
            chat_id,
            chat_title,
            user_id,
            date,
            text,
            name: `${first_name === undefined ? userName : first_name}${last_name === undefined ? '' : ` ${last_name}`}`,
        });
        loggers_1.default.info(NAMESPACE, `created new msg with text "${text}"`);
        return newMsg;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
function getChatMessages(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const messages = yield message_1.default.find({ chat_id: id });
            return messages;
        }
        catch (err) {
            return Promise.reject(err);
        }
    });
}
const getChatMessagesByTime = (id, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield message_1.default.find({ chat_id: id, date: { $gte: timestamp } }).exec();
        return messages;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
module.exports = {
    createMessage,
    getChatMessages,
    getChatMessagesByTime,
};
