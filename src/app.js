const { Telegraf } = require('telegraf');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const bot = new Telegraf(process.env.tg_bot_token);

bot.start((ctx) =>
  ctx.reply(`
    Привет ${ctx.from.first_name} я твой первый бот"
`),
);
bot.hears('hi', (ctx) => {
  return ctx.reply('Hey there');
});
//cлушаем ивент "сообщение" здесь можно будет записывать все сообщения в ДБ.
bot.on('message', (ctx) => {
  console.log(ctx.message);
  return ctx.reply('yes');
});
bot.launch().then(() => console.log('bot up and running'));
