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

module.exports = {
  syncTimeout,
  validChats,
};
