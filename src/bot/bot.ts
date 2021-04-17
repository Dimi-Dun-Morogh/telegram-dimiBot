import { Telegraf } from 'telegraf';
import logger from '../helpers/loggers';
import {
  handleStart, writeMessageToDb, getStatsByTime, getMyStats, getWordStats,
} from './handlers/messages/index';

import config from '../config/telegram';

import { handleLeave, handleJoin } from './handlers/chat_events';
import { parseJokes } from './handlers/chat_jokes';

import { isInGroupMiddleWare } from './middlewares';

import { handleAnime } from './handlers/getAnime';

import { setRules, getRules, handleHelp } from './handlers/chat_admin';
import { handleGiveAway } from './handlers/epic-games';
import {
  handleWhen, handleWho, handleInfo, handleRandomReply,
} from './handlers/chat_random';
import handleMeme from './handlers/get_meme';

const NAMESPACE = 'bot';
const bot = new Telegraf(config.botApiKey!);

// greeting & leave events
bot.on('new_chat_members', (ctx) => handleJoin(ctx));
bot.on('left_chat_member', (ctx) => handleLeave(ctx));

// MiddleWare на чек диалога (!приват)
bot.use(isInGroupMiddleWare());
// bot.use(isChatDBCreated());

// bot.command('greeter', (ctx) => ctx.scene.enter('greeter'));

//  /start здесь cоздаем новый чат в ДБ либо говорим что он создан/добавьте бота в чат
bot.start((ctx) => handleStart(ctx));

//! посчитаем кол-во всех сообщений
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
  logger.info(NAMESPACE, `/anime in chat:${ctx.chat!.id!}`);
  handleAnime(ctx);
});

bot.command('/games_info', (ctx) => handleGiveAway(ctx));

bot.command('/meme', (ctx) => handleMeme(ctx));

// bot.hears(/^бот кто\W+/g, (ctx) => handleWho(ctx)); //! todo

bot.hears(/^бот когда\W+/g, (ctx) => handleWhen(ctx));

bot.hears(/^бот инфа\W+/g, (ctx) => handleInfo(ctx));

bot.hears(['да', 'Да', 'ДА', 'нет', 'Нет', 'НЕТ', 'незнаю', 'не знаю', 'Че', 'че', 'ЧЕ'], (ctx) => handleRandomReply(ctx));

// cлушаем ивент "сообщение" здесь можно будет записывать все сообщения в ДБ.
bot.on('message', (ctx) => {
  writeMessageToDb(ctx);
});

export default bot;
