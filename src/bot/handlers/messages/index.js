const { createChat, getChatByChatId } = require('../../../controllers/chats');
const {
  createMessage,
  getChatMessages,
  getChatMessagesByTime,
} = require('../../../controllers/messages');

const handleStart = async (context) => {
  const chat = await context.getChat();
  console.log(chat);
  if (chat.type === 'group') {
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
  console.log(context.message.chat.id);
  try {
    const messages = await getChatMessages(context.message.chat.id);
    return context.reply(`сообщений за всё время ${messages.length}`);
  } catch (error) {
    console.log(error);
  }
  return null;
};

const writeMessageToDb = (context) => {
  console.log(context.message);
  if (context.message.text && context.message.chat.type === 'group') {
    createMessage(context.message);
  }
  return null;
};

const MessagesByTime = async (chatId, timeRange) => {
  try {
    let todaysMidnight = new Date();
    todaysMidnight.setHours(0, 0, 0, 0);
    todaysMidnight =
      timeRange === 'week'
        ? todaysMidnight.setDate(todaysMidnight.getDate() - 7)
        : timeRange === 'month'
        ? todaysMidnight.setDate(todaysMidnight.getDate() - 30)
        : todaysMidnight;
    const messages = await getChatMessagesByTime(chatId, Number(todaysMidnight) / 1000);
    console.log(messages);
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
    console.log(countMsgs, name, user_id);
  });
  return countMsgs;
};

const countMostUsedWords = (msgArray) => {
  return msgArray.reduce((acc, { text }) => {
    // удалим \n .replaceAll('\n', ' ')
    const words = text.replace(/\n/g, ' ').split(' ');
    words.forEach((word) => {
      acc[word] = acc[word] + 1 || 1;
    });
    return acc;
  }, {});
};

const getStatsByTime = async (context, timeRange) => {
  try {
    const {
      chat: { id },
    } = context.message;
    const dictionary = {
      week: 'последние 7 дней',
      month: 'последние 30 дней',
      day: 'день',
    };
    const messages = await MessagesByTime(id, timeRange);
    const userStat = countMsgsForEachUser(messages);
    const wordStat = countMostUsedWords(messages);
    console.log('user Stat', userStat);
    console.log('messages stat', wordStat);
    context.reply(`сообщений за ${dictionary[timeRange]} - ${messages.length}`);
  } catch (error) {
    console.log(error);
  }
};

// {
//   message_id: 197,
//   from: {
//     id: 474382995,
//     is_bot: false,
//     first_name: 'Dimi',
//     last_name: 'Dun-Morogh',
//     username: 'dimibro',
//     language_code: 'ru'
//   },
//   chat: {
//     id: -359124392,
//     title: 'testbota228',
//     type: 'group',
//     all_members_are_administrators: true
//   },
//   date: 1603152496,
//   text: '/stat day',
//   entities: [ { offset: 0, length: 5, type: 'bot_command' } ]
// }

module.exports = {
  handleStart,
  allMessagesCount,
  writeMessageToDb,
  getStatsByTime,
};
