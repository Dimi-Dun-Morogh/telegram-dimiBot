const handleLeave = (context) => {
  console.log(context);
  const { username, first_name, last_name } = context.update.message.from;
  context.reply(
    `${first_name === undefined ? username : first_name} ${
      last_name === undefined ? '' : last_name
    } ...A! Ну давай`,
  );
};

const handleJoin = (context) => {
  console.log(context);
  const { username, first_name, last_name } = context.update.message.from;
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
