// @ts-check
var mongoose = require('mongoose')

var productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    writer: { type: String, required: true },
    description: { type: String, required: true },
    request: { type: String, required: true },
    price: { type: Number, required: true },
    commission: { type: Number, required: false },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
