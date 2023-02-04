const {Schema, model} = require('mongoose');

const schema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('Account', schema);
