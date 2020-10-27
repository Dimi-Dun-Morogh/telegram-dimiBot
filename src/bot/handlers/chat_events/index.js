const handleLeave = (context) => {
  console.log(context);
  const { username, first_name, last_name } = context.update.message.left_chat_participant;
  console.log(context.update.message.left_chat_participant);
  context.reply(
    `${first_name === undefined ? username : first_name} ${
      last_name === undefined ? '' : last_name
    } ...A! Ну давай`,
  );
};

const handleJoin = (context) => {
  console.log(context.update.message.join_chat_participant);
  const { username, first_name, last_name } = context.update.message.join_chat_participant;
  context.reply(
    `Приветствую ${first_name === undefined ? username : first_name} ${
      last_name === undefined ? '' : last_name
    }, проходи, присаживайся`,
  );
};

module.exports = {
  handleLeave,
  handleJoin,
};
