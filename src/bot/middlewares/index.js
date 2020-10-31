const isInGroupMiddleWare = () => (ctx, next) => {
  const { chat, text } = ctx.message;
  const allowedCommands = ['/help', '/joke', '/start'];
  if (chat.type === 'private' && !allowedCommands.includes(text))
    return ctx.reply('Сначала добавь меня в чат, эти комманды не для приватных диалогов');
  return next();
};

module.exports = {
  isInGroupMiddleWare,
};
