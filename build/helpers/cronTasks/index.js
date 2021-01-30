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
exports.cronSayRandom = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const chats_1 = require("../../controllers/chats");
const loggers_1 = __importDefault(require("../loggers"));
const bot_1 = __importDefault(require("../../bot/bot"));
const { validChats } = require('../utils.js');
const { phrases } = require('../textConverters');
const NAMESPACE = 'cronTasks';
const cronSayRandom = node_cron_1.default
    .schedule('0 0 */12 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    loggers_1.default.info(NAMESPACE, 'random sayin');
    const chats = yield chats_1.getAllChats();
    const chatIds = chats.map(({ chat_id }) => chat_id);
    const validIds = yield validChats(chatIds, bot_1.default);
    loggers_1.default.info(NAMESPACE, `cronSayRandom valid ids ${validIds}`);
    const randomWord = Math.floor(Math.random() * phrases.length);
    const randomChat = Math.floor(Math.random() * validIds.length);
    const randomSec = Math.floor(Math.random() * 59);
    const randomHour = Math.floor(Math.random() * 4) * (1000 * 60 * 60);
    const randomMinute = Math.floor(Math.random() * 59) * (1000 * 60);
    const time = randomSec + randomMinute + randomHour;
    loggers_1.default.info(NAMESPACE, `time for random is ${time / (1000 * 60 * 60)} hrs; word - "${phrases[randomWord]}" chat - ${validIds[randomChat]}`);
    setTimeout(() => {
        bot_1.default.telegram.sendMessage(validIds[randomChat], phrases[randomWord]).catch((err) => loggers_1.default.info(NAMESPACE, 'error sending random msg', err.message));
    }, time);
}))
    .stop();
exports.cronSayRandom = cronSayRandom;
