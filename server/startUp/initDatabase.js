const IncomeCategory = require('../models/IncomeCategory')
const ExpensesCategory = require('../models/ExpensesCategory')
const incomeCategoriesMock = require('../mock/incomeCategories.json')
const expensesCategoriesMock = require('../mock/expensesCategories.json')

module.exports = async () => {
  const incomeCategories = await IncomeCategory.find()
  if (incomeCategories.length !== incomeCategoriesMock.length) {
    createInitialEntity(IncomeCategory, incomeCategoriesMock)
  }

  const expensesCategories = await ExpensesCategory.find()
  if (expensesCategories.length !== expensesCategoriesMock.length) {
    createInitialEntity(ExpensesCategory, expensesCategoriesMock)
  }
}

async function createInitialEntity(Model, data) {
  await Model.collection.drop()
  return Promise.all(data.map(async item => {
    try {
      const newItem = new Model(item)
      await newItem.save()
      return newItem
    } catch (error) {
      return error
    }
  }))
}