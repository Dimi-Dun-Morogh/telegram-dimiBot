const mongoose = require('mongoose');

const { Schema } = mongoose;
const chatSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  chat_id: {
    type: Number,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

mongoose.model('chat', chatSchema);

module.exports = mongoose.model('chat');
