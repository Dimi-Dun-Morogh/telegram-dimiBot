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
exports.getChatMessagesByTime = exports.getChatMessages = exports.createMessage = void 0;
const message_1 = __importDefault(require("../models/message"));
const loggers_1 = __importDefault(require("../helpers/loggers"));
const db_crud_1 = require("../db/db.crud");
const NAMESPACE = 'controllers/messages';
const createMessage = (messageObj) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newMsg = yield db_crud_1.createItem(message_1.default, messageObj);
        loggers_1.default.info(NAMESPACE, `created new msg with text "${messageObj.text}"`);
        return newMsg;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.createMessage = createMessage;
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
exports.getChatMessages = getChatMessages;
const getChatMessagesByTime = (id, timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield message_1.default.find({ chat_id: id, date: { $gte: timestamp } }).exec();
        return messages;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.getChatMessagesByTime = getChatMessagesByTime;
