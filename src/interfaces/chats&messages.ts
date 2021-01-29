import { Document } from 'mongoose';

interface InewChat {
  name: string;
  chat_id: number;
}

interface IChatModel extends InewChat, Document {}

interface InewMessage {
  userName: string;
  chat_id: number;
  user_id: number;
  chat_title: string;
  text: string;
  date: number;
  name: string;
}

interface ImessageModel extends InewMessage, Document {}

export {
  InewChat, IChatModel, ImessageModel, InewMessage,
};
