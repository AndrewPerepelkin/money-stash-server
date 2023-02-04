const Category = require('../models/Category');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const categoriesMock = require('../mock/categories.json');
const accountsMock = require('../mock/accounts.json');
const transactionsMock = require('../mock/accounts.json');

module.exports = async () => {
  const categories = await Category.find();
  const accounts = await Account.find();
  const transaction = await Transaction.find();
  // if (Categories.length !== CategoriesMock.length) {
  //   createInitialEntity(Category, CategoriesMock)
  // }
  if (!categories) {
    createInitialEntity(Category, categoriesMock);
  }
  if (!accounts) {
    createInitialEntity(Account, accountsMock);
  }
  if (!transaction) {
    createInitialEntity(Transaction, transactionsMock);
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
