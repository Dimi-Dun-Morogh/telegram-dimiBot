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
exports.getAllChats = exports.updateChat = exports.getChatByChatId = exports.createChat = void 0;
const loggers_1 = __importDefault(require("../helpers/loggers"));
const chat_1 = __importDefault(require("../models/chat"));
const db_crud_1 = require("../db/db.crud");
const NAMESPACE = 'controllers/chats';
const createChat = (chatObj) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newChat = yield db_crud_1.createItem(chat_1.default, chatObj);
        return newChat;
    }
    catch (error) {
        loggers_1.default.info(NAMESPACE, `error createChat, ${error.message}`);
    }
});
exports.createChat = createChat;
const getChatByChatId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatById = yield db_crud_1.getItemByChatId(chat_1.default, id);
        return chatById;
    }
    catch (error) {
        loggers_1.default.info(NAMESPACE, `error getChatByChatId, ${error.message}`);
    }
});
exports.getChatByChatId = getChatByChatId;
const getAllChats = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield db_crud_1.getAllItems(chat_1.default);
        return chats;
    }
    catch (error) {
        loggers_1.default.info(NAMESPACE, `error getAllChats, ${error.message}`);
    }
});
exports.getAllChats = getAllChats;
const updateChat = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chat_1.default.updateOne({ chat_id: id }, data, { upsert: true });
        const chatUpdated = yield chat_1.default.findOne({ chat_id: id });
        return chatUpdated;
    }
    catch (error) {
        loggers_1.default.info(NAMESPACE, `error updateChat, ${error.message}`);
    }
});
exports.updateChat = updateChat;
