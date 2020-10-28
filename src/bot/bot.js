const { Telegraf, Context } = require('telegraf');
const { handleStart, writeMessageToDb, getStatsByTime } = require('./handlers/messages/index');
const { botApiKey } = require('../config/telegram');
const { handleLeave, handleJoin } = require('./handlers/chat_events');
const { setRules, getRules, handleHelp } = require('./handlers/chat_admin');

const bot = new Telegraf(botApiKey);
bot.command('greeter', (ctx) => ctx.scene.enter('greeter'));

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

// greeting & leave events
bot.on('new_chat_members', (ctx) => handleJoin(ctx));
bot.on('left_chat_member', (ctx) => handleLeave(ctx));

// cлушаем ивент "сообщение" здесь можно будет записывать все сообщения в ДБ.
bot.on('message', (ctx) => {
  writeMessageToDb(ctx);
});

module.exports = bot;
