const { Telegraf } = require('telegraf');
const { handleStart, writeMessageToDb, getStatsByTime } = require('./handlers/messages/index');
const { botApiKey } = require('../config/telegram');
const { handleLeave, handleJoin } = require('./handlers/chat_events');

const bot = new Telegraf(botApiKey);
bot.command('greeter', (ctx) => ctx.scene.enter('greeter'));

//  /start здесь cоздаем новый чат в ДБ либо говорим что он создан/добавьте бота в чат
bot.start((ctx) => handleStart(ctx));

//! посчитаем кол-во всех сообщений
bot.hears('/stat', async (ctx) => getStatsByTime(ctx, 'all time'));

bot.hears('/stat day', async (ctx) => getStatsByTime(ctx, 'day'));

bot.hears('/stat week', async (ctx) => getStatsByTime(ctx, 'week'));

bot.hears('/stat month', async (ctx) => getStatsByTime(ctx, 'month'));

// greeting & leave events
bot.on('new_chat_members', (ctx) => handleJoin(ctx));
bot.on('left_chat_member', (ctx) => handleLeave(ctx));

// cлушаем ивент "сообщение" здесь можно будет записывать все сообщения в ДБ.
bot.on('message', (ctx) => {
  //  console.log(ctx);
  writeMessageToDb(ctx);
});

module.exports = bot;
