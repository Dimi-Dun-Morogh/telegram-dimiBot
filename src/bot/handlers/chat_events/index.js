const { getChatByChatId } = require('../../../controllers/chats');

const handleLeave = (context) => {
  // console.log(context);
  const { username, first_name, last_name } = context.update.message.left_chat_participant;
  // console.log(context.update.message.left_chat_participant);
  context.reply(
    `${first_name === undefined ? username : first_name} ${
      last_name === undefined ? '' : last_name
    } ...A! Ну давай`,
  );
};

const handleJoin = async (context) => {
  console.log('new chat member');
  const { username, first_name, last_name } = context.update.message.new_chat_participant;
  context.reply(
    `Приветствую ${first_name === undefined ? username : first_name} ${
      last_name === undefined ? '' : last_name
    }, проходи, присаживайся`,
  );
  const remoteChat = await getChatByChatId(context.message.chat.id);
  const { rules } = remoteChat;
  if (rules.length) context.reply(rules);
};

module.exports = {
  handleLeave,
  handleJoin,
};
