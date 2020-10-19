const getItemById = (collection, id) => collection.findById(id);
const getAllItems = (collection) => collection.find();
const createItem = (collection, data) =>
  collection.updateOne({ name: data.name }, data, { upsert: true });
const deleteItem = (collection, id) => collection.findOneAndRemove({ _id: id });
const updateItem = (collection, data) => createItem(collection, data);
const getItemByName = (collection, nameVal) => collection.findOne({ name: nameVal });
const getItemByChatId = (collection, id) => collection.findOne({ chat_id: id });

module.exports = {
  getItemById,
  getAllItems,
  createItem,
  deleteItem,
  updateItem,
  getItemByName,
  getItemByChatId,
};
