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
    const chatById = await getItemByChatId(chat, id);
    return chatById;
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateChat = async (id, data) => {
  try {
    await chat.updateOne({ chat_id: id }, data, { upsert: true });
    const chatUpdated = await chat.findOne({ chat_id: id });
    return chatUpdated;
  } catch (error) {
    return Promise.reject(error);
  }
};
module.exports = {
  createChat,
  getChatByChatId,
  updateChat,
};
