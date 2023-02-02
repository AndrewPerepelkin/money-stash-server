const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: String,
  email: {type: String, required: true, unique: true},
  password: String,
  image: String,
  income: [{type: Schema.Types.ObjectId, ref: 'Income'}],
  expenses: [{type: Schema.Types.ObjectId, ref: 'Expense'}],
  accounts: [{type: Schema.Types.ObjectId, ref: 'Account'}],
}, {
  timestamps: true
})

module.exports = model('User', schema)