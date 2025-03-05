const mongoose = require('mongoose')

const productSechema = new mongoose.Schema({
    productname: { type: String, required: true },
    productnum: { type: String, required: true },
    productEx: { type: Date, required: true },
    userid: { type: String, required: true }
})

module.exports = mongoose.model('productSechema', productSechema)