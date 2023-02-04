const {Schema, model} = require('mongoose')

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  type: {type: String, enum: ['income', 'expense']},
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
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

module.exports = model('Transaction', schema)