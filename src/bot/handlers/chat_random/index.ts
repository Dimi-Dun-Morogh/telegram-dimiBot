import { TelegrafContext } from 'telegraf/typings/context';
import replies from '../../../mocks/randomReplies';
import chatState from '../../state';

const { randomDate } = require('../../../helpers/utils');

export const handleWho = async (ctx: TelegrafContext) => {
  // const participants = await ctx.
  // console.log(participants);
};

export const handleWhen = (ctx: TelegrafContext) => {
  const { message_id, text } = ctx.message!;
  const messageText = text?.split(' ');
  const msgStr = messageText![0].toLowerCase() === 'бот' ? messageText?.slice(2).join(' ')
    : messageText?.slice(1).join(' ');

  const timeWhen = randomDate();
  ctx.reply(`я думаю ${msgStr} - случится ${timeWhen}`, { reply_to_message_id: message_id });
};

export const handleInfo = (ctx: TelegrafContext) => {
  const { message_id, text } = ctx.message!;
  const messageText = text?.split(' ');
  const msgStr = messageText![0].toLowerCase() === 'бот' ? messageText?.slice(2).join(' ')
    : messageText?.slice(1).join(' ');
  const randomNumber = Math.floor(Math.random() * 101);

  ctx.reply(`вероятность шо ${msgStr} - ${randomNumber}%`, { reply_to_message_id: message_id });
};

export const handleRandomReply = (ctx: TelegrafContext) => {
  if (chatState.randomReplyCd) return;
  const { message_id, text } = ctx.message!;
  const word = text!.replace(/\s/g, '').toLowerCase();
  const arrayOfReplies = replies[word];
  const reply = arrayOfReplies[Math.floor(Math.random() * arrayOfReplies.length)];

  chatState.randomReplyCd = true;
  setTimeout(() => chatState.randomReplyCd = false, 60000);
  ctx.reply(reply!, { reply_to_message_id: message_id });
};
