// @ts-check
var mongoose = require('mongoose')

var productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    writer: { type: String, required: true },
    description: { type: String, required: true },
    request: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
