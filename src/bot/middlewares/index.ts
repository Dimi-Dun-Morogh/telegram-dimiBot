import { NextFunction } from 'express';
import { TelegrafContext } from 'telegraf/typings/context';
import logger from '../../helpers/loggers';

import { getChatByChatId } from '../../controllers/chats';

const NAMESPACE = 'BOT-MIDDLEWARE';

const isInGroupMiddleWare = () => async (ctx: TelegrafContext, next: NextFunction) => {
  try {
    if (!ctx || !ctx.message || !ctx.message.text) return null;
    const { chat, text } = ctx.message;
    logger.info(NAMESPACE, `chat: ${chat.id} chat_name: ${chat.title}, text: ${text}`);
    const allowedCommands = ['/help', '/joke', '/start', '/anime', '/games_info'];
    const chatCommands = ['/stat', '/stat_day', '/stat_week', '/stat_month', '/set_rules', '/rules'];
    const isChatCommand = chatCommands.some((item) => text.includes(item));
    if (chat.type === 'private' && !allowedCommands.includes(text)) {
      return ctx.reply('Сначала добавь меня в чат, эти комманды не для приватных диалогов');
    }
    if ((chat.type === 'supergroup' || chat.type === 'group') && isChatCommand) {
      const chatExists = await getChatByChatId(chat.id);
      if (!chatExists) {
        return ctx.reply('похоже вы не нажали /start после добавления бота в группу');
      }
    }
    return next();
  } catch (error) {
    logger.info(NAMESPACE, `error in  isInGroupMiddleWare: ${error.message}`, error);
  }
};

export { isInGroupMiddleWare };
