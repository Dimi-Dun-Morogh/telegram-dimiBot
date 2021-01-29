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
const loggers_1 = __importDefault(require("../../helpers/loggers"));
const chats_1 = require("../../controllers/chats");
const NAMESPACE = 'BOT-MIDDLEWARE';
const isInGroupMiddleWare = () => (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!ctx || !ctx.message || !ctx.message.text)
            return null;
        const { chat, text } = ctx.message;
        loggers_1.default.info(NAMESPACE, `chat: ${chat.id}, text: ${text}`);
        const allowedCommands = ['/help', '/joke', '/start', '/anime'];
        const chatCommands = ['/stat', '/stat_day', '/stat_week', '/stat_month', '/set_rules', '/rules'];
        const isChatCommand = chatCommands.some((item) => text.includes(item));
        if (chat.type === 'private' && !allowedCommands.includes(text)) {
            return ctx.reply('Сначала добавь меня в чат, эти комманды не для приватных диалогов');
        }
        if ((chat.type === 'supergroup' || chat.type === 'group') && isChatCommand) {
            const chatExists = yield chats_1.getChatByChatId(chat.id);
            if (!chatExists) {
                return ctx.reply('похоже вы не нажали /start после добавления бота в группу');
            }
        }
        return next();
    }
    catch (error) {
        loggers_1.default.info(NAMESPACE, `error in  isInGroupMiddleWare: ${error.message}`, error);
    }
});
module.exports = {
    isInGroupMiddleWare,
};
