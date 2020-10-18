const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  chat_id: {
    type: Number,
  },
});

mongoose.model('chat', chatSchema);

module.exports = mongoose.model('chat');
