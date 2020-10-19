const { Telegraf } = require('telegraf');
const { botApiKey } = require('../config/telegram');
const { createChat, getChatByChatId } = require('../controllers/chats');

const bot = new Telegraf(botApiKey);

//  /start здесь можно создавать новый чат в ДБ

bot.start(async (ctx) => {
  const chat = await ctx.getChat();
  console.log(chat);
  if (chat.type === 'group') {
    try {
      const chatExists = await getChatByChatId(chat.id);
      if (!chatExists) {
        await createChat(chat);
        return ctx.reply(`${ctx.from.first_name} я создал бд для ${chat.title}`);
      }
      ctx.reply(`${ctx.from.first_name} база данных для ${chat.title} уже была создана`);
    } catch (error) {
      console.log(error);
      return ctx.reply(`${ctx.from.first_name} ошибка в создании бд для ${chat.title}`);
    }
  }
  return ctx.reply(`${ctx.from.first_name} добавь меня в чат`);
});

bot.hears('hi', (ctx) => {
  return ctx.reply('Hey there');
});

// cлушаем ивент "сообщение" здесь можно будет записывать все сообщения в ДБ.
bot.on('message', (ctx) => {
  console.log(ctx.message);
  if (ctx.message.text) {
    return ctx.reply('yes');
  }
});

module.exports = bot;
