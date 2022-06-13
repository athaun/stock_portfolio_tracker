const mongoose = require("mongoose")
const { Schema } = mongoose;

const ListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    assets: [{ type: Schema.Types.ObjectId, ref: 'Asset' }]
})

const List = mongoose.model('List', ListSchema)

module.exports = List