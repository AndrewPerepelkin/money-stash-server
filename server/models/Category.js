const {Schema, model} = require('mongoose')

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId, ref: 'User' // ???
  },
  custom: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
})

module.exports = model('Category', schema)



