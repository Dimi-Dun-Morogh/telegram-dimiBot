const { Telegraf } = require('telegraf');
const { botApiKey } = require('../config/telegram');
const { handleStart, allMessagesCount, writeMessageToDb } = require('./handlers/messages/index');

const bot = new Telegraf(botApiKey);

//  /start здесь cоздаем новый чат в ДБ либо говорим что он создан/добавьте бота в чат
bot.start((ctx) => handleStart(ctx));

//! посчитаем кол-во всех сообщений
bot.hears('/stat', async (ctx) => allMessagesCount(ctx));

// cлушаем ивент "сообщение" здесь можно будет записывать все сообщения в ДБ.
bot.on('message', (ctx) => writeMessageToDb(ctx));

module.exports = bot;
