const chat = require('../models/chat');
const { createItem, getItemByChatId } = require('../db/db.crud');

const createChat = async (chatObj) => {
  try {
    const { id, title } = chatObj;
    const newChat = await createItem(chat, { name: title, chat_id: id });
    return newChat;
  } catch (error) {
    return Promise.reject(error);
  }
};
const getChatByChatId = async (id) => {
  try {
    const chatExists = await getItemByChatId(chat, id);
    return Boolean(chatExists);
  } catch (error) {
    return Promise.reject(error);
  }
};
module.exports = {
  createChat,
  getChatByChatId,
};
