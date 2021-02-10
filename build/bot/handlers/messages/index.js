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
exports.getWordStats = exports.getMyStats = exports.getStatsByTime = exports.writeMessageToDb = exports.allMessagesCount = exports.handleStart = void 0;
const chats_1 = require("../../../controllers/chats");
const messages_1 = require("../../../controllers/messages");
const { textToEmoji } = require('../../../helpers/textConverters');
const handleStart = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const chat = yield context.getChat();
    if (chat.type === 'group' || chat.type === 'supergroup') {
        try {
            const chatExists = yield chats_1.getChatByChatId(chat.id);
            if (!chatExists) {
                yield chats_1.createChat({
                    name: chat.title,
                    chat_id: chat.id,
                });
                return context.reply(`${(_a = context.from) === null || _a === void 0 ? void 0 : _a.first_name} я создал бд для ${chat.title}`);
            }
            return context.reply(`${(_b = context.from) === null || _b === void 0 ? void 0 : _b.first_name} база данных для ${chat.title} уже была создана`);
        }
        catch (error) {
            console.log(error);
            return context.reply(`${(_c = context.from) === null || _c === void 0 ? void 0 : _c.first_name} ошибка в создании бд для ${chat.title}`);
        }
    }
    return context.reply(`${(_d = context.from) === null || _d === void 0 ? void 0 : _d.first_name} добавь меня в чат`);
});
exports.handleStart = handleStart;
const allMessagesCount = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const messages = yield messages_1.getChatMessages((_e = context.message) === null || _e === void 0 ? void 0 : _e.chat.id);
        return context.reply(`сообщений за всё время ${messages.length}`);
    }
    catch (error) {
        console.log(error);
    }
    return null;
});
exports.allMessagesCount = allMessagesCount;
const writeMessageToDb = (context) => {
    const { text, chat, caption, from, date, } = context.message;
    if ((text || caption) && (chat.type === 'group' || chat.type === 'supergroup')) {
        const msgString = typeof text === 'string' ? text : caption;
        const newMsgObj = {
            userName: from === null || from === void 0 ? void 0 : from.username,
            chat_id: chat.id,
            chat_title: chat.title,
            user_id: from === null || from === void 0 ? void 0 : from.id,
            date,
            text: msgString,
            name: `${!(from === null || from === void 0 ? void 0 : from.first_name) ? from === null || from === void 0 ? void 0 : from.username : from === null || from === void 0 ? void 0 : from.first_name}${(from === null || from === void 0 ? void 0 : from.last_name) === undefined ? '' : ` ${from === null || from === void 0 ? void 0 : from.last_name}`}`,
        };
        messages_1.createMessage(newMsgObj);
    }
    return null;
};
exports.writeMessageToDb = writeMessageToDb;
const MessagesByTime = (chatId, timeRange) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (timeRange === 'all time')
            return yield messages_1.getChatMessages(chatId);
        let todaysMidnight = new Date();
        todaysMidnight.setHours(0, 0, 0, 0);
        todaysMidnight = timeRange === 'week' ? todaysMidnight.setDate(todaysMidnight.getDate() - 7) : timeRange === 'month' ? todaysMidnight.setDate(todaysMidnight.getDate() - 30) : todaysMidnight;
        const messages = yield messages_1.getChatMessagesByTime(chatId, Number(todaysMidnight) / 1000);
        return messages;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
const countMsgsForEachUser = (msgArray) => {
    const countMsgs = msgArray.reduce((acc, { user_id }) => {
        acc[user_id] = acc[user_id] + 1 || 1;
        return acc;
    }, {});
    msgArray.forEach(({ userName, name, user_id }) => {
        countMsgs[user_id] = {
            userName,
            name,
            count: countMsgs[user_id].count || countMsgs[user_id],
            user_id,
        };
    });
    return countMsgs;
};
const countMostUsedWords = (msgArray) => msgArray.reduce((acc, { text = '' }) => {
    const words = text
        .replace(/\n/g, ' ')
        .replace(/[.,?!]/g, '')
        .split(' ');
    words.forEach((word) => {
        const wordLc = word.toLowerCase();
        if (word.length > 2)
            acc[wordLc] = acc[wordLc] + 1 || 1;
    });
    return acc;
}, {});
const renderStringWithWordStats = (wordStat) => {
    let strResult = `${textToEmoji('lightning')} Топ ${textToEmoji(10)} слов: \n`;
    Object.entries(wordStat)
        .sort((a, b) => b[1] - a[1])
        .filter((word, index) => index < 10)
        .forEach(([word, count]) => (strResult += `${textToEmoji('pin2')} ${word} : ${count}\n`));
    return strResult;
};
const renderStringWithUserStats = (userStat) => {
    let strResult = `${textToEmoji('lightning')}Топ 10 зяблов${textToEmoji('lightning')} по кол-ву сообщений${textToEmoji('speech')} : \n`;
    Object.entries(userStat)
        .sort((a, b) => b[1].count - a[1].count)
        .filter((word, index) => index < 10)
        .forEach(([, { userName, name, count }]) => (strResult += `${textToEmoji('pin')} ${name !== undefined ? name : userName} ${textToEmoji('boom')} ${count}\n`));
    return strResult;
};
const getMyStats = (context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chat, from } = context.message;
        const messages = yield messages_1.getChatMessages(chat.id).then((arr) => arr.filter((msg) => msg.user_id === (from === null || from === void 0 ? void 0 : from.id)));
        if (!messages)
            return context.reply('что-то с ботом или у вас нет сообщений');
        const wordStat = countMostUsedWords(messages);
        const wordStatRendered = renderStringWithWordStats(wordStat);
        const dateFirstMsg = new Date(messages[0].date * 1000);
        const finalString = `статистика для ${textToEmoji('saintsRow')}${messages[messages.length - 1].name}${textToEmoji('saintsRow')} начиная с ${dateFirstMsg.toLocaleDateString()}:\n сообщений ${textToEmoji(messages.length)}\n\n${wordStatRendered}`;
        return context.reply(finalString);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getMyStats = getMyStats;
const getWordStats = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const { chat, text } = context.message;
    const [, word] = text.split(' ');
    if (word === undefined)
        return context.reply('укажите слово через пробел после /stat_word ');
    const messages = yield messages_1.getChatMessages(chat.id);
    if (!messages)
        return null;
    const wordStat = countMostUsedWords(messages);
    const date = new Date(messages[0].date * 1000);
    const stats = wordStat[word] || 0;
    let varietyStr = '';
    Object.entries(wordStat)
        .filter(([key]) => key.includes(word.toLowerCase()))
        .forEach(([key, value]) => (varietyStr += `\n${key} : ${value} ${textToEmoji('lightning')}`));
    console.log(stats, 'wordstat');
    return context.reply(`начиная с ${date.toLocaleDateString()} слово ${textToEmoji('pin')}"${word}"${textToEmoji('pin')} было написано ${stats} раз${textToEmoji('boom')}\n включая вариации:\n ${varietyStr}`);
});
exports.getWordStats = getWordStats;
const getStatsByTime = (context, timeRange) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chat: { id }, } = context.message;
        const dictionary = {
            week: `последние ${textToEmoji(7)} дней`,
            month: `последние ${textToEmoji(30)} дней`,
            day: 'день',
            'all time': 'всё время',
        };
        const messages = yield MessagesByTime(id, timeRange);
        const userStat = countMsgsForEachUser(messages);
        const wordStat = countMostUsedWords(messages);
        const wordStatRendered = renderStringWithWordStats(wordStat);
        const userStatRendered = renderStringWithUserStats(userStat);
        context.reply(`${textToEmoji('saintsRow')}Cообщений за ${dictionary[timeRange]} - ${textToEmoji(messages.length)}\n
${userStatRendered}\n${textToEmoji('small_triangle') + textToEmoji('small_triangle') + textToEmoji('small_triangle') + textToEmoji('small_triangle')}\n\n${wordStatRendered}`);
    }
    catch (error) {
        console.log(error);
    }
});
exports.getStatsByTime = getStatsByTime;
