const mongoose = require('mongoose');

const priceModel = new mongoose.Schema({
    ethereum: {
        inr: {
            type: Number,
            trim: true
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('ethereumPrice', priceModel)
