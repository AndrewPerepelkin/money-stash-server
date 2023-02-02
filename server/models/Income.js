const {Schema, model} = require('mongoose')

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  category: { type: Schema.Types.ObjectId, ref: 'IncomeCategory' },
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  name: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

module.exports = model('Income', schema)