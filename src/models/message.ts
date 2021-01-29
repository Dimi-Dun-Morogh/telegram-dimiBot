import mongoose from 'mongoose';
import { ImessageModel } from '../interfaces/chats&messages';

const messageSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  chat_id: {
    type: Number,
  },
  user_id: {
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
  name: {
    type: String,
  },
});

export default mongoose.model<ImessageModel>('Message', messageSchema);
