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
exports.handleJoin = exports.handleLeave = void 0;
const loggers_1 = __importDefault(require("../../../helpers/loggers"));
const chats_1 = require("../../../controllers/chats");
const NAMESPACE = 'chat_events';
const handleLeave = (context) => {
    try {
        const { username, first_name, last_name } = context.update.message.left_chat_member;
        const farewells = ['...A! Ну давай', 'ПАЛ ДЕВОЧКА', 'ЯСНА БАН'];
        const randomBye = farewells[Math.floor(Math.random() * farewells.length)];
        context.reply(`${first_name === undefined ? username : first_name} ${last_name === undefined ? '' : last_name} ${randomBye}`);
    }
    catch (error) {
        loggers_1.default.info(NAMESPACE, `error handleLeave: ${error.message}`);
    }
};
exports.handleLeave = handleLeave;
const handleJoin = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { username, first_name, last_name } = (_a = context.update.message.new_chat_members) === null || _a === void 0 ? void 0 : _a.pop();
        loggers_1.default.info(NAMESPACE, `new chat member @${username} | ${`${first_name} ${last_name}`}`);
        context.reply(`Приветствую ${!first_name ? username : first_name} ${!last_name ? '' : last_name}, проходи, присаживайся`);
        const remoteChat = yield chats_1.getChatByChatId(context.message.chat.id);
        if (!remoteChat)
            return null;
        const { rules } = remoteChat;
        if (rules.length)
            context.reply(rules);
    }
    catch (error) {
        loggers_1.default.info(NAMESPACE, `error handleJoin: ${error.message}`);
    }
});
exports.handleJoin = handleJoin;
