import { TelegrafContext } from 'telegraf/typings/context';
import { createChat, getChatByChatId } from '../../../controllers/chats';
import { InewMessage, IusersStat, IwordStat } from '../../../interfaces/chats&messages';

import { createMessage, getChatMessages, getChatMessagesByTime } from '../../../controllers/messages';

const { textToEmoji } = require('../../../helpers/textConverters');

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
        return context.reply(`${context.from?.first_name} я создал бд для ${chat.title}`);
      }
      return context.reply(`${context.from?.first_name} база данных для ${chat.title} уже была создана`);
    } catch (error) {
      console.log(error);
      return context.reply(`${context.from?.first_name} ошибка в создании бд для ${chat.title}`);
    }
  }
  return context.reply(`${context.from?.first_name} добавь меня в чат`);
};

const allMessagesCount = async (context: TelegrafContext) => {
  try {
    const messages = await getChatMessages(context.message?.chat.id!);
    return context.reply(`сообщений за всё время ${messages.length}`);
  } catch (error) {
    console.log(error);
  }
  return null;
};

const writeMessageToDb = (context: TelegrafContext) => {
  const {
    text, chat, caption, from, date,
  } = context.message!;
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
  } catch (error) {
    return Promise.reject(error);
  }
};

const countMsgsForEachUser = (msgArray: Array<InewMessage>) => {
  const countMsgs = msgArray.reduce((acc: any, { user_id }) => {
    acc[user_id] = acc[user_id] + 1 || 1;
    return acc;
  }, {});
  msgArray.forEach(({ userName, name, user_id }) => {
    countMsgs[user_id] = {
      userName,
      name,
      count: countMsgs[user_id].count || countMsgs[user_id],
      user_id,
    };
  });
  return countMsgs;
};

const countMostUsedWords = (msgArray: Array<InewMessage>): IwordStat => msgArray.reduce((acc: any, { text = '' }) => {
  // удалим \n .replaceAll('\n', ' ') и ,!.
  const words = text
    .replace(/\n/g, ' ')
    .replace(/[.,?!]/g, '')
    .split(' ');
  words.forEach((word) => {
    const wordLc = word.toLowerCase();
    if (word.length > 3) acc[wordLc] = acc[wordLc] + 1 || 1;
  });
  return acc;
}, {});

const renderStringWithWordStats = (wordStat: IwordStat) => {
  let strResult = `${textToEmoji('lightning')} Топ ${textToEmoji(10)} слов: \n`;
  // filter wordStat to have only 10 indexes and sort by most used;
  Object.entries(wordStat)
    .sort((a, b) => b[1] - a[1])
    .filter((word, index) => index < 10)
    .forEach(([word, count]) => (strResult += `${textToEmoji('pin2')} ${word} : ${count}\n`));
  return strResult;
};

const renderStringWithUserStats = (userStat: IusersStat) => {
  let strResult = `${textToEmoji('lightning')}Топ 10 зяблов${textToEmoji('lightning')} по кол-ву сообщений${textToEmoji('speech')} : \n`;
  // filter userStat to have only 10 indexes and sort by msg count
  Object.entries(userStat)
    .sort((a, b) => b[1].count - a[1].count)
    .filter((word, index) => index < 10)
    .forEach(([, { userName, name, count }]) => (strResult += `${textToEmoji('pin')} ${name !== undefined ? name : userName} ${textToEmoji('boom')} ${count}\n`));
  return strResult;
};

const getMyStats = async (context: TelegrafContext) => {
  try {
    const { chat, from } = context.message!;
    const messages = await getChatMessages(chat.id).then((arr: Array<InewMessage>) => arr.filter(
      (msg) => msg.user_id === from?.id,
    ));

    if (!messages) return context.reply('что-то с ботом или у вас нет сообщений');

    const wordStat = countMostUsedWords(messages);
    const wordStatRendered = renderStringWithWordStats(wordStat);
    const dateFirstMsg = new Date(messages[0].date * 1000);
    const finalString = `статистика для ${textToEmoji('saintsRow')}${messages[messages.length - 1].name}${textToEmoji(
      'saintsRow',
    )} начиная с ${dateFirstMsg.toLocaleDateString()}:\n сообщений ${textToEmoji(messages.length)}\n\n${wordStatRendered}`;
    return context.reply(finalString);
  } catch (error) {
    console.log(error);
  }
};

const getWordStats = async (context: TelegrafContext) => {
  const { chat, text } = context.message!;
  const [, word] = text!.split(' ');
  if (word === undefined) return context.reply('укажите слово через пробел после /stat_word ');
  const messages = await getChatMessages(chat.id);
  if (!messages) return null;
  const wordStat = countMostUsedWords(messages);
  const date = new Date(messages[0].date * 1000);
  const stats = wordStat[word];
  let varietyStr = '';
  Object.entries(wordStat)
    .filter(([key]) => key.includes(word))
    .forEach(([key, value]) => (varietyStr += `\n${key} : ${value} ${textToEmoji('lightning')}`));
  console.log(stats);
  if (stats === undefined) return context.reply(`для ${word} еще нет статистики`);
  return context.reply(
    `начиная с ${date.toLocaleDateString()} слово ${textToEmoji('pin')}"${word}"${textToEmoji('pin')} было написано ${stats} раз${textToEmoji('boom')}\n включая вариации:\n ${varietyStr}`,
  );
};

const getStatsByTime = async (context: TelegrafContext, timeRange: string) => {
  try {
    const {
      chat: { id },
    } = context.message!;
    const dictionary: { [key: string]: string } = {
      week: `последние ${textToEmoji(7)} дней`,
      month: `последние ${textToEmoji(30)} дней`,
      day: 'день',
      'all time': 'всё время',
    };
    const messages = await MessagesByTime(id, timeRange);
    const userStat = countMsgsForEachUser(messages);
    const wordStat = countMostUsedWords(messages);
    const wordStatRendered = renderStringWithWordStats(wordStat);
    const userStatRendered = renderStringWithUserStats(userStat);
    context.reply(
      `${textToEmoji('saintsRow')}Cообщений за ${dictionary[timeRange]} - ${textToEmoji(messages.length)}\n
${userStatRendered}\n${textToEmoji('small_triangle') + textToEmoji('small_triangle') + textToEmoji('small_triangle') + textToEmoji('small_triangle')}\n\n${wordStatRendered}`,
    );
  } catch (error) {
    console.log(error);
  }
};

export {
  handleStart, allMessagesCount, writeMessageToDb, getStatsByTime, getMyStats, getWordStats,
};
