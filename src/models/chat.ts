import mongoose from 'mongoose';
import { IChatModel } from '../interfaces/chats&messages';

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
  rules: {
    type: String,
    default: '',
  },
});

export default mongoose.model<IChatModel>('chat', chatSchema);
