"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemByChatId = exports.getItemByName = exports.updateItem = exports.deleteItem = exports.createItem = exports.getAllItems = exports.getItemById = void 0;
const getItemById = (collection, id) => collection.findById(id);
exports.getItemById = getItemById;
const getAllItems = (collection) => collection.find();
exports.getAllItems = getAllItems;
const createItem = (collection, data) => collection.create(data);
exports.createItem = createItem;
const deleteItem = (collection, id) => collection.findOneAndRemove({ _id: id });
exports.deleteItem = deleteItem;
const updateItem = (collection, data) => createItem(collection, data);
exports.updateItem = updateItem;
const getItemByName = (collection, nameVal) => collection.findOne({
    name: nameVal,
});
exports.getItemByName = getItemByName;
const getItemByChatId = (collection, id) => collection.findOne({ chat_id: id });
exports.getItemByChatId = getItemByChatId;
