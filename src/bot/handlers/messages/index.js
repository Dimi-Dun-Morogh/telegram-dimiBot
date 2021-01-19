const { createChat, getChatByChatId } = require('../../../controllers/chats');
const {
  createMessage,
  getChatMessages,
  getChatMessagesByTime,
} = require('../../../controllers/messages');
const { textToEmoji } = require('../../../helpers/textConverters');

const handleStart = async (context) => {
  const chat = await context.getChat();
  if (chat.type === 'group' || chat.type === 'supergroup') {
    try {
      const chatExists = await getChatByChatId(chat.id);
      if (!chatExists) {
        await createChat(chat);
        return context.reply(`${context.from.first_name} я создал бд для ${chat.title}`);
      }
      return context.reply(
        `${context.from.first_name} база данных для ${chat.title} уже была создана`,
      );
    } catch (error) {
      console.log(error);
      return context.reply(`${context.from.first_name} ошибка в создании бд для ${chat.title}`);
    }
  }
  return context.reply(`${context.from.first_name} добавь меня в чат`);
};

const allMessagesCount = async (context) => {
  // console.log(context.message.chat.id);
  try {
    const messages = await getChatMessages(context.message.chat.id);
    return context.reply(`сообщений за всё время ${messages.length}`);
  } catch (error) {
    console.log(error);
  }
  return null;
};

const writeMessageToDb = (context) => {
  // console.log(context.message);
  const { text, chat, caption } = context.message;
  if (
    (text !== undefined || caption !== undefined) &&
    (chat.type === 'group' || chat.type === 'supergroup')
  ) {
    const msgString = typeof text === 'string' ? text : caption;
    createMessage({ ...context.message, text: msgString });
  }
  return null;
};

const MessagesByTime = async (chatId, timeRange) => {
  try {
    if (timeRange === 'all time') return await getChatMessages(chatId);
    let todaysMidnight = new Date();
    todaysMidnight.setHours(0, 0, 0, 0);
    todaysMidnight =
      timeRange === 'week'
        ? todaysMidnight.setDate(todaysMidnight.getDate() - 7)
        : timeRange === 'month'
        ? todaysMidnight.setDate(todaysMidnight.getDate() - 30)
        : todaysMidnight;
    const messages = await getChatMessagesByTime(chatId, Number(todaysMidnight) / 1000);
    return messages;
  } catch (error) {
    return Promise.reject(error);
  }
};

const countMsgsForEachUser = (msgArray) => {
  const countMsgs = msgArray.reduce((acc, { user_id }) => {
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

const countMostUsedWords = (msgArray) => {
  return msgArray.reduce((acc, { text = '' }) => {
    // удалим \n .replaceAll('\n', ' ') и ,!.
    const words = text
      .replace(/\n/g, ' ')
      .replace(/[.,?!]/g, '')
      .split(' ');
    words.forEach((word) => {
      word = word.toLowerCase();
      if (word.length > 3) acc[word] = acc[word] + 1 || 1;
    });
    return acc;
  }, {});
};

const renderStringWithWordStats = (wordStat) => {
  let strResult = `${textToEmoji('lightning')} Топ ${textToEmoji(10)} слов: \n`;
  // filter wordStat to have only 10 indexes and sort by most used;
  Object.entries(wordStat)
    .sort((a, b) => b[1] - a[1])
    .filter((word, index) => index < 10)
    .forEach(([word, count]) => (strResult += `${textToEmoji('pin2')} ${word} : ${count}\n`));
  // console.log(strResult);
  return strResult;
};

const renderStringWithUserStats = (userStat) => {
  let strResult = `${textToEmoji('lightning')}Топ 10 зяблов${textToEmoji(
    'lightning',
  )} по кол-ву сообщений${textToEmoji('speech')} : \n`;
  // filter userStat to have only 10 indexes and sort by msg count
  Object.entries(userStat)
    .sort((a, b) => b[1].count - a[1].count)
    .filter((word, index) => index < 10)
    .forEach(
      ([, { userName, name, count }]) =>
        (strResult += `${textToEmoji('pin')} ${name !== undefined ? name : userName} ${textToEmoji(
          'boom',
        )} ${count}\n`),
    );
  return strResult;
};

const getMyStats = async (context) => {
  try {
    const { chat, from } = context.message;
    const messages = await getChatMessages(chat.id).then((arr) =>
      arr.filter((msg) => msg.user_id === from.id),
    );
    if (!messages) return context.reply('что-то с ботом или у вас нет сообщений');
    const wordStat = countMostUsedWords(messages);
    const wordStatRendered = renderStringWithWordStats(wordStat);
    const dateFirstMsg = new Date(messages[0].date * 1000);
    const finalString = `статистика для ${textToEmoji('saintsRow')}${
      messages[messages.length - 1].name
    }${textToEmoji(
      'saintsRow',
    )} начиная с ${dateFirstMsg.toLocaleDateString()}:\n сообщений ${textToEmoji(
      messages.length,
    )}\n\n${wordStatRendered}`;
    return context.reply(finalString);
  } catch (error) {
    console.log(error);
  }
};

const getWordStats = async (context) => {
  const { chat, text } = context.message;
  const [, word] = text.split(' ');
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
    `начиная с ${date.toLocaleDateString()} слово ${textToEmoji('pin')}"${word}"${textToEmoji(
      'pin',
    )} было написано ${stats} раз${textToEmoji('boom')}\n включая вариации:\n ${varietyStr}`,
  );
};

const getStatsByTime = async (context, timeRange) => {
  try {
    const {
      chat: { id },
    } = context.message;
    const dictionary = {
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
      `${textToEmoji('saintsRow')}Cообщений за ${dictionary[timeRange]} - ${textToEmoji(
        messages.length,
      )}\n
${userStatRendered}\n${
        textToEmoji('small_triangle') +
        textToEmoji('small_triangle') +
        textToEmoji('small_triangle') +
        textToEmoji('small_triangle')
      }\n\n${wordStatRendered}`,
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleStart,
  allMessagesCount,
  writeMessageToDb,
  getStatsByTime,
  getMyStats,
  getWordStats,
};
