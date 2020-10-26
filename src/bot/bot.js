const { Telegraf } = require('telegraf');
const { botApiKey } = require('../config/telegram');
const { handleStart, writeMessageToDb, getStatsByTime } = require('./handlers/messages/index');

const bot = new Telegraf(botApiKey);

//  /start здесь cоздаем новый чат в ДБ либо говорим что он создан/добавьте бота в чат
bot.start((ctx) => handleStart(ctx));

//! посчитаем кол-во всех сообщений
bot.hears('/stat', async (ctx) => getStatsByTime(ctx, 'all time'));

bot.hears('/stat day', async (ctx) => getStatsByTime(ctx, 'day'));

bot.hears('/stat week', async (ctx) => getStatsByTime(ctx, 'week'));

bot.hears('/stat month', async (ctx) => getStatsByTime(ctx, 'month'));

// cлушаем ивент "сообщение" здесь можно будет записывать все сообщения в ДБ.
bot.on('message', (ctx) => writeMessageToDb(ctx));

module.exports = bot;
