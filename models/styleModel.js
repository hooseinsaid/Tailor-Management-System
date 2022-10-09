const mongoose = require("mongoose");

const opts = {
    toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}

const styleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    }, 
    type: {
        type: String,
        required: true
    }
}, opts);


const Style = mongoose.model('Style', styleSchema);

module.exports = Style;