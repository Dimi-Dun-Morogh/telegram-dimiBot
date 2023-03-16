import { Telegraf } from 'telegraf';
import logger from '../helpers/loggers';
import { Message } from 'typegram';
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
  handleWhen, handleInfo, handleRandomReply,
} from './handlers/chat_random';
import handleMeme from './handlers/get_meme';
import COMMANDS from './commands';
import handleWeather from './handlers/weather';

const NAMESPACE = 'bot';
const bot = new Telegraf(config.botApiKey!);

const {
  INFO, WHEN, RANDOM_REPLY, WEATHER,
} = COMMANDS;

// greeting & leave events
// bot.on('new_chat_members', (ctx) => handleJoin(ctx, ctx.message as Message.NewChatMembersMessage));
// bot.on('left_chat_member', (ctx) => handleLeave(ctx, ctx.message as Message.LeftChatMemberMessage));

// MiddleWare на чек диалога (!приват)
bot.use(isInGroupMiddleWare());
// bot.use(isChatDBCreated());

//  /start здесь cоздаем новый чат в ДБ либо говорим что он создан/добавьте бота в чат
bot.start((ctx) => handleStart(ctx));

//! посчитаем кол-во всех сообщений
bot.hears(/^\/stat/, (ctx) => getStatsByTime(ctx, 'all time'));

bot.hears(/^\/stat_day/ , (ctx) => getStatsByTime(ctx, 'day'));

bot.hears(/^\/stat_week/, (ctx) => getStatsByTime(ctx, 'week'));

bot.hears(/^\/stat_month/, (ctx) => getStatsByTime(ctx, 'month'));

bot.hears(/^\/set_rules/, (ctx) => setRules(ctx));

bot.hears(/^\/rules/, (ctx) => getRules(ctx));

bot.hears(/^\/help/, (ctx) => handleHelp(ctx));

bot.hears(/^\/joke/, (ctx) => parseJokes(ctx));

bot.hears(/^\/stat_me/, (ctx) => getMyStats(ctx));

bot.hears(/^\/stat_word/, (ctx) => getWordStats(ctx));

bot.hears(/^\/anime/, (ctx) => {
  logger.info(NAMESPACE, `/anime in chat:${ctx.chat!.id!}`);
  handleAnime(ctx);
});

//bot.command('/games_info', (ctx) => handleGiveAway(ctx));

//bot.command('/meme', (ctx) => handleMeme(ctx));

// bot.hears(/^бот кто\W+/g, (ctx) => handleWho(ctx)); //! todo

bot.hears(WHEN, (ctx) => handleWhen(ctx));

bot.hears(INFO, (ctx) => handleInfo(ctx));

bot.hears(RANDOM_REPLY, (ctx) => handleRandomReply(ctx));

bot.hears(WEATHER, (ctx) => handleWeather(ctx));

// cлушаем ивент "сообщение" здесь можно будет записывать все сообщения в ДБ.
bot.on('message', (ctx) => {
  writeMessageToDb(ctx);
});

export default bot;
