const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: String,
  email: {type: String, required: true, unique: true},
  password: String,
  image: String,
  transactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}],
  categories: [{type: Schema.Types.ObjectId, ref: 'Category'}],
  accounts: [{type: Schema.Types.ObjectId, ref: 'Account'}],
}, {
  timestamps: true
})

module.exports = model('User', schema)