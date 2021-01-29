import { getAllChats } from '../../controllers/chats';

import logger from '../loggers';

const cron = require('node-cron');
const bot = require('../../bot/bot.js');

const { validChats } = require('../utils.js');
const { phrases } = require('../textConverters');

const NAMESPACE = 'cronTasks';

const cronSayRandom = cron
  .schedule('0 0 */12 * * *', async () => {
    logger.info(NAMESPACE, 'random sayin');
    const chats = await getAllChats();
    const chatIds = chats.map(({ chat_id }) => chat_id);
    const validIds = await validChats(chatIds, bot);
    logger.info(NAMESPACE, `cronSayRandom valid ids ${validIds}`);

    const randomWord = Math.floor(Math.random() * phrases.length);
    const randomChat = Math.floor(Math.random() * validIds.length);

    const randomSec = Math.floor(Math.random() * 59);
    const randomHour = Math.floor(Math.random() * 4) * (1000 * 60 * 60);
    const randomMinute = Math.floor(Math.random() * 59) * (1000 * 60);
    const time = randomSec + randomMinute + randomHour;
    logger.info(NAMESPACE, `time for random is ${time / (1000 * 60 * 60)} hrs; word - "${phrases[randomWord]}" chat - ${validIds[randomChat]}`);

    setTimeout(() => {
      bot.telegram.sendMessage(validIds[randomChat], phrases[randomWord]).catch((err) => logger.info(NAMESPACE, 'error sending random msg', err.message));
    }, time);
  })
  .stop();

module.exports = {
  cronSayRandom,
};
