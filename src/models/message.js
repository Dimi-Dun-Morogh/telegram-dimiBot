const mongoose = require('mongoose');

// const { Schema } = mongoose;
const messageSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  chat_id: {
    type: Number,
  },
  chat_title: {
    type: String,
  },
  text: {
    type: String,
  },
  date: {
    type: Number,
  },
  // chat: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'chat',
  // },
});

mongoose.model('Message', messageSchema);

module.exports = mongoose.model('Message');
