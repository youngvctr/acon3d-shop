// @ts-check
var mongoose = require('mongoose')

var selectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    request: { type: String, required: true },
    commission: { type: Number, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Select', selectSchema)
