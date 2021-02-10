import logger from '../helpers/loggers';
import { InewChat } from '../interfaces/chats&messages';
import chat from '../models/chat';

import { createItem, getItemByChatId, getAllItems } from '../db/db.crud';

const NAMESPACE = 'controllers/chats';

const createChat = async (chatObj: InewChat) => {
  try {
    const newChat = await createItem(chat, chatObj);
    return newChat;
  } catch (error) {
    logger.info(NAMESPACE, `error createChat, ${error.message}`);
  }
};
const getChatByChatId = async (id: number) => {
  try {
    const chatById = await getItemByChatId(chat, id);
    return chatById;
  } catch (error) {
    logger.info(NAMESPACE, `error getChatByChatId, ${error.message}`);
  }
};

const getAllChats = async (): Promise<Array<InewChat> | undefined> => {
  try {
    const chats = await getAllItems(chat);
    return chats;
  } catch (error) {
    logger.info(NAMESPACE, `error getAllChats, ${error.message}`);
  }
};

const updateChat = async (id: number, data: any) => {
  try {
    await chat.updateOne({ chat_id: id }, data, { upsert: true });
    const chatUpdated = await chat.findOne({ chat_id: id });
    return chatUpdated;
  } catch (error) {
    logger.info(NAMESPACE, `error updateChat, ${error.message}`);
  }
};
export { createChat, getChatByChatId, updateChat, getAllChats };
