const { Telegraf } = require('telegraf');
const { botApiKey } = require('./config/telegram');
const connectDb = require('./db/db-connect');

const bot = new Telegraf(botApiKey);
// ! /start здесь можно создавать новый чат в ДБ
bot.start((ctx) =>
  ctx.reply(`
    Привет ${ctx.from.first_name} я твой первый бот"
`),
);
bot.hears('hi', (ctx) => {
  return ctx.reply('Hey there');
});
// cлушаем ивент "сообщение" здесь можно будет записывать все сообщения в ДБ.
bot.on('message', (ctx) => {
  console.log(ctx.message);
  return ctx.reply('yes');
});

connectDb().then(() => console.log('connect to db success'));
bot.launch().then(() => console.log('bot up and running'));
