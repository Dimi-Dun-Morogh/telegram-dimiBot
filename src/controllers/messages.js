const message = require('../models/message');
const { createItem } = require('../db/db.crud');
const logger = require('../helpers/loggers');

const NAMESPACE = 'controllers/messages';

const createMessage = async (messageObj) => {
  try {
    const {
      from: { username: userName, first_name, last_name, id: user_id },
      chat: { id: chat_id, title: chat_title },
      date,
      text,
    } = messageObj;
    if (text === undefined || !text) return;
    const newMsg = await createItem(message, {
      userName,
      chat_id,
      chat_title,
      user_id,
      date,
      text,
      name: `${first_name === undefined ? userName : first_name}${
        last_name === undefined ? '' : ` ${last_name}`
      }`,
    });
    logger.info(NAMESPACE, `created new msg with text "${text}"`);
    return newMsg;
  } catch (error) {
    return Promise.reject(error);
  }
};

async function getChatMessages(id) {
  try {
    const messages = await message.find({ chat_id: id });
    return messages;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 *
 * @param {number} id
 * @param {number} timestamp
 * 10 digit number ( regular Date/1000)
 */
const getChatMessagesByTime = async (id, timestamp) => {
  try {
    const messages = await message.find({ chat_id: id, date: { $gte: timestamp } }).exec();
    return messages;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = {
  createMessage,
  getChatMessages,
  getChatMessagesByTime,
};
