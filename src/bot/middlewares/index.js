const { getChatByChatId } = require('../../controllers/chats');

const isInGroupMiddleWare = () => async (ctx, next) => {
  if (ctx === undefined || ctx === null || ctx.message === undefined) return null;
  const { chat, text } = ctx.message;
  const allowedCommands = ['/help', '/joke', '/start'];
  const chatCommands = ['/stat', '/stat_day', '/stat_week', '/stat_month', '/set_rules', '/rules'];
  const isChatCommand = chatCommands.some((item) => text.includes(item));
  if (chat.type === 'private' && !allowedCommands.includes(text))
    return ctx.reply('Сначала добавь меня в чат, эти комманды не для приватных диалогов');
  if ((chat.type === 'supergroup' || chat.type === 'group') && isChatCommand) {
    const chatExists = await getChatByChatId(chat.id);
    if (!chatExists) return ctx.reply('похоже вы не нажали /start после добавления бота в группу');
  }
  return next();
};

module.exports = {
  isInGroupMiddleWare,
};
