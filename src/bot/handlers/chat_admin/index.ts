import { TelegrafContext } from 'telegraf/typings/context';
import { updateChat, getChatByChatId } from '../../../controllers/chats';

const { syncTimeout } = require('../../../helpers/utils');

const { textToEmoji } = require('../../../helpers/textConverters');

const setRules = async (context: TelegrafContext) => {
  const { text, chat, from } = context.message!;
  const id = from?.id!;

  const admins = await context.getChatAdministrators();
  const isAdmin = Boolean(admins.find(({ user }) => user.id === id));
  const rulesString = text!.slice(10);
  if (!isAdmin) return context.reply('Вы не админ и не создатель, кыш `(^.^)`');
  if (!rulesString) return context.reply('Э, а где текст правил???');
  const updChat = await updateChat(chat.id, { rules: rulesString });
  context.reply('хуян.......');
  await syncTimeout(4000);
  await context.reply('хуяндок!');
  await context.reply(updChat!.rules!);
  return context.reply('Правила установлены');
};

const getRules = async (context: TelegrafContext) => {
  try {
    const { chat } = context.message!;
    const remoteChat = await getChatByChatId(chat.id);
    if (!remoteChat) return null;
    const { rules } = remoteChat;
    console.log(rules);
    if (!rules.length) return context.reply('ленивый  админ еще не установил правила');
    context.reply(rules);
  } catch (error) {
    console.log(error.message);
  }
};

const handleHelp = (context: TelegrafContext) => {
  const helpString = `${textToEmoji('lightning')}Список комманд${textToEmoji('lightning')}\n
${textToEmoji('green_snowflake')} /stat - вернет статистику по чату за всё время\n
${textToEmoji('green_snowflake')} /stat_day , /stat_week , /stat_month - тоже самое но за день/7дней/30дней\n
${textToEmoji('green_snowflake')} /set_rules - установить правила чата( /set_rules любой текст) доступно только админам\n
${textToEmoji('green_snowflake')} /joke - рассказать анекдот\n
${textToEmoji('green_snowflake')} /anime - рандомное аниме\n
${textToEmoji('green_snowflake')} /meme - рандомное meme\n
${textToEmoji('green_snowflake')} /games_info - показать текущие раздачи в ЕГС магазине\n
${textToEmoji('green_snowflake')} бот когда / бот инфо - узнать  вероятность или дату чего либо, пример "бот когда рак свиснет"\n
${textToEmoji('green_snowflake')} бот погода город_нейм, узнать погоду на сегодня\n
${textToEmoji('green_snowflake')} /rules - показать правила\n`;
  context.reply(helpString);
};

export { setRules, getRules, handleHelp };
