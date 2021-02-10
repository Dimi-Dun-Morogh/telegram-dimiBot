import { Model } from 'mongoose';
import { DataObj, ID } from '../interfaces/types';

const getItemById = (collection: Model<any>, id: ID) => collection.findById(id);

const getAllItems = (collection: Model<any>) => collection.find();

const createItem = (collection: Model<any>, data: DataObj) => collection.create(data);

const deleteItem = (collection: Model<any>, id: ID) => collection.findOneAndRemove({ _id: id });

const updateItem = (collection: Model<any>, data: DataObj) => createItem(collection, data);

const getItemByName = (collection: Model<any>, nameVal: string) =>
  collection.findOne({
    name: nameVal,
  });

const getItemByChatId = (collection: Model<any>, id: ID) => collection.findOne({ chat_id: id });

export { getItemById, getAllItems, createItem, deleteItem, updateItem, getItemByName, getItemByChatId };
