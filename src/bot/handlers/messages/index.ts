import { TelegrafContext } from 'telegraf/typings/context';
import { createChat, getChatByChatId } from '../../../controllers/chats';
import { InewMessage } from '../../../interfaces/chats&messages';

import { createMessage, getChatMessages, getChatMessagesByTime } from '../../../controllers/messages';
import { renderMsg } from '../../bot-utils/renderMessages';
import logger from '../../../helpers/loggers';

const NAMESPACE = 'MESSAGES';

const handleStart = async (context: TelegrafContext) => {
  const chat = await context.getChat();
  if (chat.type === 'group' || chat.type === 'supergroup') {
    try {
      const chatExists = await getChatByChatId(chat.id);
      if (!chatExists) {
        await createChat({
          name: chat.title!,
          chat_id: chat.id,
        });
        return await context.reply(`${context.from?.first_name} я создал бд для ${chat.title}`);
      }
      return await context.reply(`${context.from?.first_name} база данных для ${chat.title} уже была создана`);
    } catch (error:any) {
      logger.error(NAMESPACE, error.message, error);
      return context.reply(`${context.from?.first_name} ошибка в создании бд для ${chat.title}`);
    }
  }
  return context.reply(`${context.from?.first_name} добавь меня в чат`).catch((err) => logger.error(NAMESPACE, 'error', err));
};

const allMessagesCount = async (context: TelegrafContext) => {
  try {
    const messages = await getChatMessages(context.message?.chat.id!);
    return await context.reply(`сообщений за всё время ${messages!.length}`);
  } catch (error:any) {
    logger.error(NAMESPACE, error.message, error);
  }
  return null;
};

const writeMessageToDb = (context: TelegrafContext) => {
  if (context.message?.forward_date) return;
  const {
    text, chat, caption, from, date,
  } = context.message!;
  if (from?.is_bot) return;
  if ((text || caption) && (chat.type === 'group' || chat.type === 'supergroup')) {
    const msgString = typeof text === 'string' ? text : caption;

    const newMsgObj = {
      userName: from?.username!,
      chat_id: chat.id,
      chat_title: chat.title!,
      user_id: from?.id!,
      date,
      text: msgString!,
      name: `${!from?.first_name ? from?.username : from?.first_name}${from?.last_name === undefined ? '' : ` ${from?.last_name}`}`,
    };

    createMessage(newMsgObj);
  }
  return null;
};

const MessagesByTime = async (chatId: number, timeRange: string) => {
  try {
    if (timeRange === 'all time') return await getChatMessages(chatId);

    let todaysMidnight: Date | number = new Date();
    todaysMidnight.setHours(0, 0, 0, 0);
    todaysMidnight = timeRange === 'week' ? todaysMidnight.setDate(todaysMidnight.getDate() - 7) : timeRange === 'month' ? todaysMidnight.setDate(todaysMidnight.getDate() - 30) : todaysMidnight;

    const messages = await getChatMessagesByTime(chatId, Number(todaysMidnight) / 1000);
    return messages;
  } catch (error:any) {
    logger.error(NAMESPACE, error.message, error);
  }
};

const getMyStats = async (context: TelegrafContext) => {
  try {
    const { chat, from } = context.message!;
    // @ts-ignore
    const messages = await getChatMessages(chat.id).then((arr: Array<InewMessage>) => arr.filter(
      (msg) => msg.user_id === from?.id,
    ));

    if (!messages) return await context.reply('что-то с ботом или у вас нет сообщений');

    const stats = renderMsg.myStatsStr(messages);

    return await context.reply(stats);
  } catch (error:any) {
    logger.error(NAMESPACE, error.message, error);
  }
};

const getWordStats = async (context: TelegrafContext) => {
  try {
    const { chat, text, message_id } = context.message!;
    const [, word] = text!.split(' ');

    if (word === undefined) return await context.reply('укажите слово через пробел после /stat_word ');
    if (word.length < 3) return await context.reply('не балуй', { reply_to_message_id: message_id });
    console.log('sdas');
    const messages = await getChatMessages(chat.id);
    if (!messages) return null;
    const stats = renderMsg.wordStatsStr(messages, word);
    const encoded = Buffer.from(stats, 'utf-8').toString();

    return await context.replyWithHTML(encoded);
  } catch (error) {
    console.error(error);
  }
};

const getStatsByTime = async (context: TelegrafContext, timeRange:string) => {
  try {
    const {
      chat: { id },
    } = context.message!;

    const messages = await MessagesByTime(id, timeRange);
    if (!messages) return null;

    const stats = renderMsg.statsByTimeStr(messages, timeRange);
    context.reply(stats);
  } catch (error:any) {
    logger.error(NAMESPACE, error.message, error);
  }
};

export {
  handleStart, allMessagesCount, writeMessageToDb, getStatsByTime, getMyStats, getWordStats,
};
