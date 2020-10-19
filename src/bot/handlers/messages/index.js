const { createChat, getChatByChatId } = require('../../../controllers/chats');
const { createMessage, getChatMessages } = require('../../../controllers/messages');

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
    console.log(messages);
    return context.reply(`всего сообщений в базе ${messages.length}`);
  } catch (error) {
    console.log(error);
  }
  return context.reply('Hey there');
};

const writeMessageToDb = (context) => {
  if (context.message.text && context.message.chat.type === 'group') {
    createMessage(context.message);
  }
  return null;
};

module.exports = {
  handleStart,
  allMessagesCount,
  writeMessageToDb,
};
