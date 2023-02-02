const express = require('express')
const router = express.Router({ mergeParams: true })

router.use('/auth', require('./auth.routes'))
router.use('/income', require('./income.routes'))
router.use('/income-categories', require('./incomeCategories.routes'))
router.use('/expenses', require('./expenses.routes'))
router.use('/expenses-categories', require('./expensesCategories.routes'))
router.use('/accounts', require('./accounts.routes'))
router.use('/user', require('./user.routes'))

module.exports = router