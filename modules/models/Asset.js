const mongoose = require("mongoose")
const { Schema } = mongoose;

const AssetSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true
    },
    type: {
        type: String,
        lowercase: true,
        enum: ["stock", "crypto"],
        required: true
    },
    buyPrice: {
        type: Number,
        default: null
    },
    quantity: {
        type: Number,
        default: 1
    }
})

const Asset = mongoose.model('Asset', AssetSchema)

module.exports = Asset