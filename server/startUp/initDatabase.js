const Category = require('../models/Category');
const categoriesMock = require('../mock/Categories.json');

module.exports = async () => {
  const categories = await Category.find();
  // if (Categories.length !== CategoriesMock.length) {
  //   createInitialEntity(Category, CategoriesMock)
  // }
  if (!categories) {
    createInitialEntity(Category, categoriesMock);
  }
};

async function createInitialEntity(Model, data) {
  await Model.collection.drop();
  return Promise.all(
    data.map(async (item) => {
      try {
        const newItem = new Model(item);
        await newItem.save();
        return newItem;
      } catch (error) {
        return error;
      }
    })
  );
}
