import { TelegrafContext } from 'telegraf/typings/context';
import logger from '../../../helpers/loggers';
import { getChatByChatId } from '../../../controllers/chats';
import { Message } from 'typegram';




const NAMESPACE = 'chat_events';

const handleLeave = (context: TelegrafContext, msg : Message.LeftChatMemberMessage):void => {
  try {
    const { username, first_name, last_name } = msg.left_chat_member!;


    // console.log(context.update.message?.left_chat_member);
    const farewells = ['...A! Ну давай', 'ПАЛ ДЕВОЧКА', 'ЯСНА БАН', 'БАН НАХОЙ', 'Пал дебил'];
    const randomBye = farewells[Math.floor(Math.random() * farewells.length)];
    context.reply(`${first_name === undefined ? username : first_name} ${last_name === undefined ? '' : last_name} ${randomBye}`);
  } catch (error) {
    logger.info(NAMESPACE, `error handleLeave: ${error.message}`);
  }
};

const handleJoin = async (context: TelegrafContext, msg: Message.NewChatMembersMessage):Promise<void|null> => {
  try {
    const { username, first_name, last_name, is_bot } = msg.new_chat_members.pop()!;

    if (is_bot) return;
    logger.info(NAMESPACE, `new chat member @${username} | ${`${first_name} ${last_name}`}`);

    context.reply(`Приветствую ${!first_name ? username : first_name} ${!last_name ? '' : last_name}, проходи, присаживайся`);
    const remoteChat = await getChatByChatId(context.message!.chat.id);
    if (!remoteChat) return null;
    const { rules } = remoteChat;
    if (rules.length) context.reply(rules);
  } catch (error) {
    logger.info(NAMESPACE, `error handleJoin: ${error.message}`);
  }
};

export { handleLeave, handleJoin };
