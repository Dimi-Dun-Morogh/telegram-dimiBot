"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggers_1 = __importDefault(require("../helpers/loggers"));
const { Telegraf } = require('telegraf');
const { handleStart, writeMessageToDb, getStatsByTime, getMyStats, getWordStats } = require('./handlers/messages/index');
const { botApiKey } = require('../config/telegram');
const { handleLeave, handleJoin } = require('./handlers/chat_events');
const { setRules, getRules, handleHelp } = require('./handlers/chat_admin');
const { parseJokes } = require('./handlers/chat_jokes');
const { isInGroupMiddleWare } = require('./middlewares');
const handleAnime = require('./handlers/getAnime');
const NAMESPACE = 'bot';
const bot = new Telegraf(botApiKey);
bot.on('new_chat_members', (ctx) => handleJoin(ctx));
bot.on('left_chat_member', (ctx) => handleLeave(ctx));
bot.use(isInGroupMiddleWare());
bot.command('greeter', (ctx) => ctx.scene.enter('greeter'));
bot.start((ctx) => handleStart(ctx));
bot.command('/stat', (ctx) => getStatsByTime(ctx, 'all time'));
bot.command('/stat_day', (ctx) => getStatsByTime(ctx, 'day'));
bot.command('/stat_week', (ctx) => getStatsByTime(ctx, 'week'));
bot.command('/stat_month', (ctx) => getStatsByTime(ctx, 'month'));
bot.command('/set_rules', (ctx) => setRules(ctx));
bot.command('/rules', (ctx) => getRules(ctx));
bot.command('/help', (ctx) => handleHelp(ctx));
bot.command('/joke', (ctx) => parseJokes(ctx));
bot.command('/stat_me', (ctx) => getMyStats(ctx));
bot.command('/stat_word', (ctx) => getWordStats(ctx));
bot.command('/anime', (ctx) => {
    loggers_1.default.info(NAMESPACE, `/anime in chat:${ctx.chat.id}`);
    handleAnime(ctx);
});
bot.on('message', (ctx) => {
    writeMessageToDb(ctx);
});
module.exports = bot;
