const { syncTimeout } = require('../../../helpers/utils');
const { updateChat, getChatByChatId } = require('../../../controllers/chats');
const { textToEmoji } = require('../../../helpers/textConverters');

const setRules = async (context) => {
  const {
    text,
    chat,
    from: { id },
  } = context.message;
  console.log('chat id', chat.id);
  if (chat.type === 'private') return null; //! middleware needed
  const admins = await context.getChatAdministrators();
  const isAdmin = Boolean(admins.find(({ user }) => user.id === id));
  const rulesString = text.slice(10);
  if (!isAdmin) return context.reply('Вы не админ и не создатель, кыш `(^.^)`');
  if (!rulesString) return context.reply('Э, а где текст правил???');
  const updChat = await updateChat(chat.id, { rules: rulesString });
  context.reply('хуян.......');
  await syncTimeout(4000);
  await context.reply('хуяндок!');
  await context.reply(updChat.rules);
  return context.reply('Правила установлены');
};

const getRules = async (context) => {
  const { chat } = context.message;
  if (chat.type === 'private') return null;
  const remoteChat = await getChatByChatId(chat.id);
  const { rules } = remoteChat;
  console.log(rules);
  if (!rules.length) return context.reply('ленивый  админ еще не установил правила');
  context.reply(rules);
};

const handleHelp = (context) => {
  const helpString = `${textToEmoji('lightning')}Список комманд${textToEmoji('lightning')}\n
${textToEmoji('green_snowflake')} /stat - вернет статистику по чату за всё время\n
${textToEmoji(
  'green_snowflake',
)} /stat_day , /stat_week , /stat_month - тоже самое но за день/7дней/30дней\n
${textToEmoji(
  'green_snowflake',
)} /set_rules - установить правила чата( /set_rules любой текст) доступно только админам\n
${textToEmoji('green_snowflake')} /rules - показать правила\n`;
  context.reply(helpString);
};

module.exports = {
  setRules,
  getRules,
  handleHelp,
};
