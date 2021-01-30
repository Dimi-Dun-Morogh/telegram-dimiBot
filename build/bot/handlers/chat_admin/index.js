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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHelp = exports.getRules = exports.setRules = void 0;
const chats_1 = require("../../../controllers/chats");
const { syncTimeout } = require('../../../helpers/utils');
const { textToEmoji } = require('../../../helpers/textConverters');
const setRules = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, chat, from } = context.message;
    const id = from === null || from === void 0 ? void 0 : from.id;
    const admins = yield context.getChatAdministrators();
    const isAdmin = Boolean(admins.find(({ user }) => user.id === id));
    const rulesString = text.slice(10);
    if (!isAdmin)
        return context.reply('Вы не админ и не создатель, кыш `(^.^)`');
    if (!rulesString)
        return context.reply('Э, а где текст правил???');
    const updChat = yield chats_1.updateChat(chat.id, { rules: rulesString });
    context.reply('хуян.......');
    yield syncTimeout(4000);
    yield context.reply('хуяндок!');
    yield context.reply(updChat.rules);
    return context.reply('Правила установлены');
});
exports.setRules = setRules;
const getRules = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chat } = context.message;
        const remoteChat = yield chats_1.getChatByChatId(chat.id);
        if (!remoteChat)
            return null;
        const { rules } = remoteChat;
        console.log(rules);
        if (!rules.length)
            return context.reply('ленивый  админ еще не установил правила');
        context.reply(rules);
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.getRules = getRules;
const handleHelp = (context) => {
    const helpString = `${textToEmoji('lightning')}Список комманд${textToEmoji('lightning')}\n
${textToEmoji('green_snowflake')} /stat - вернет статистику по чату за всё время\n
${textToEmoji('green_snowflake')} /stat_day , /stat_week , /stat_month - тоже самое но за день/7дней/30дней\n
${textToEmoji('green_snowflake')} /set_rules - установить правила чата( /set_rules любой текст) доступно только админам\n
${textToEmoji('green_snowflake')} /joke - рассказать анекдот\n
${textToEmoji('green_snowflake')} /anime - рандомное аниме\n
${textToEmoji('green_snowflake')} /rules - показать правила\n`;
    context.reply(helpString);
};
exports.handleHelp = handleHelp;
