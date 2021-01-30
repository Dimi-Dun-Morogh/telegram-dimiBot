"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const loggers_1 = __importDefault(require("../helpers/loggers"));
const index_1 = require("./handlers/messages/index");
const telegram_1 = __importDefault(require("../config/telegram"));
const chat_events_1 = require("./handlers/chat_events");
const chat_jokes_1 = require("./handlers/chat_jokes");
const middlewares_1 = require("./middlewares");
const getAnime_1 = require("./handlers/getAnime");
const chat_admin_1 = require("./handlers/chat_admin");
const NAMESPACE = 'bot';
const bot = new telegraf_1.Telegraf(telegram_1.default.botApiKey);
bot.on('new_chat_members', (ctx) => chat_events_1.handleJoin(ctx));
bot.on('left_chat_member', (ctx) => chat_events_1.handleLeave(ctx));
bot.use(middlewares_1.isInGroupMiddleWare());
bot.start((ctx) => index_1.handleStart(ctx));
bot.command('/stat', (ctx) => index_1.getStatsByTime(ctx, 'all time'));
bot.command('/stat_day', (ctx) => index_1.getStatsByTime(ctx, 'day'));
bot.command('/stat_week', (ctx) => index_1.getStatsByTime(ctx, 'week'));
bot.command('/stat_month', (ctx) => index_1.getStatsByTime(ctx, 'month'));
bot.command('/set_rules', (ctx) => chat_admin_1.setRules(ctx));
bot.command('/rules', (ctx) => chat_admin_1.getRules(ctx));
bot.command('/help', (ctx) => chat_admin_1.handleHelp(ctx));
bot.command('/joke', (ctx) => chat_jokes_1.parseJokes(ctx));
bot.command('/stat_me', (ctx) => index_1.getMyStats(ctx));
bot.command('/stat_word', (ctx) => index_1.getWordStats(ctx));
bot.command('/anime', (ctx) => {
    loggers_1.default.info(NAMESPACE, `/anime in chat:${ctx.chat.id}`);
    getAnime_1.handleAnime(ctx);
});
bot.on('message', (ctx) => {
    index_1.writeMessageToDb(ctx);
});
exports.default = bot;
