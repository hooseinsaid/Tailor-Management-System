const mongoose = require("mongoose");

const opts = {
    toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}

const menuSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    coverImageUrl: {
        type: String,
        required: true,
    },
    menuProducts: [
    ]
}, opts);


const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;