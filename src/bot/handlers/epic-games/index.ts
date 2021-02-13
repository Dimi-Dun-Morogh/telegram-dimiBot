import { TelegrafContext } from 'telegraf/typings/context';
import { renderMsg } from '../../bot-utils/renderMessages';
import { epicGames } from './giveAway';

export const handleGiveAway = async (ctx: TelegrafContext) => {
  //
  const { games } = epicGames;
  const msg = renderMsg.giveAway(games);
  ctx.reply(msg);
};
