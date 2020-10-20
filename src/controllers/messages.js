const message = require('../models/message');
const { createItem } = require('../db/db.crud');

const createMessage = async (messageObj) => {
  try {
    const {
      from: { username: userName },
      chat: { id: chat_id, title: chat_title },
      date,
      text,
    } = messageObj;
    console.log({ userName, chat_id, chat_title, date, text });
    const newMsg = await createItem(message, {
      userName,
      chat_id,
      chat_title,
      date,
      text,
      chat: '5f8ce6209083886a616e11e1',
    });
    console.log('created new msg');
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

/*
{
  message_id: 91,
  from: {
    id: 474382995,
    is_bot: false,
    first_name: 'Dimi',
    last_name: 'Dun-Morogh',
    username: 'dimibro',
    language_code: 'ru'
  },
  chat: {
    id: -359124392,
    title: 'testbota228',
    type: 'group',
    all_members_are_administrators: true
  },
  date: 1603109025,
  text: 'sasdasd'
}

*/

module.exports = {
  createMessage,
  getChatMessages,
  getChatMessagesByTime,
};
