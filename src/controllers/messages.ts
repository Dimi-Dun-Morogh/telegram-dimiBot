import message from '../models/message';
import logger from '../helpers/loggers';

import { createItem } from '../db/db.crud';
import { InewMessage } from '../interfaces/chats&messages';
import chatState from '../bot/state';

const NAMESPACE = 'controllers/messages';

const createMessage = async (messageObj: InewMessage) => {
  try {
    const newMsg = await createItem(message, messageObj);
    //   logger.info(NAMESPACE, `created new msg with text "${messageObj.text}"`);
    chatState.latestMessage = `чат id: ${messageObj.chat_id}, username: ${messageObj.userName}, text: ${messageObj.text}`;
    return newMsg;
  } catch (error) {
    logger.error(NAMESPACE, 'error createMessage', error);
  }
};

async function getChatMessages(id: number) {
  try {
    const messages = await message.find({ chat_id: id });
    return messages;
  } catch (err) {
    logger.error(NAMESPACE, 'error getChatMessagesByTime', err);
  }
}

/**
 *
 * @param {number} id
 * @param {number} timestamp
 * 10 digit number ( regular Date/1000)
 */
const getChatMessagesByTime = async (id: number, timestamp: number) => {
  try {
    const messages = await message.find({ chat_id: id, date: { $gte: timestamp } }).exec();
    return messages;
  } catch (error) {
    logger.error(NAMESPACE, 'error getChatMessagesByTime', error);
  }
};

export { createMessage, getChatMessages, getChatMessagesByTime };
