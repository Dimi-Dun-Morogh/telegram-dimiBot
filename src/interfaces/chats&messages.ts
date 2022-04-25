import { Document } from 'mongoose';

interface InewChat {
  name: string;
  chat_id: number;
  rules?: string;
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

interface IuserStatSingle {
  username: string;
  name: string;
  count: number;
  user_id: number;
}

interface IusersStat {
  userId: IuserStatSingle;
}

interface IwordStat {[key:string]:{count:number, items: string[]}}

export {
  InewChat, IChatModel, ImessageModel, InewMessage, IusersStat, IwordStat,
};
