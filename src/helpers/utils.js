import { format } from 'date-fns';
import chatState from '../bot/state';
import logger from './loggers';

const NAMESPACE = 'utils.js';

async function syncTimeout(time) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

/**
 *
 * @param {[string]} chatIds
 *  @param {bot } bot
 * will go through array of IDs and return only ones that bot has access to
 */
const validChats = async (chatIds, bot) => {
  const promises = chatIds.map((chatId) => bot.telegram
    .getChat(chatId)
    .then((res) => res.id)
    .catch((error) => logger.info(NAMESPACE, `seems like chat is not valid id: ${chatId}`, error.message)));
  const res = await Promise.all(promises);
  return res.filter((item) => item !== undefined);
};

function randomDate(startHour, endHour) {
  const start = new Date();
  const end = new Date();
  end.setFullYear(start.getFullYear() + 3);
  const date = new Date(+start + Math.random() * (end - start));
  const hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date.toLocaleDateString();
}

function BotStatusHtml(uptime) {
  return `
  <!DOCTYPE html>
  <html>
  <style>body {
    margin: 0 25%;
  text-align: center;
  color: green;
  background-color: blanchedalmond;
  font-size: 140%;
  }
  </style>
  <head>
      <title>bot-status</title>
      <meta charset="utf-8" />
  </head>
  <body>
      <h1>бот аптайм с: ${uptime}</h1>
      <h3>последнее сообщение: ${chatState.latestMessage}</h3>
  </body>
  <html>
`;
}

function formatDate(val) {
  const date = new Date(val * 1000);
  return format(date, 'HH:mm');
}

module.exports = {
  syncTimeout,
  validChats,
  randomDate,
  BotStatusHtml,
  formatDate,
};
