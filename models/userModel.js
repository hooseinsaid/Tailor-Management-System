const mongoose = require("mongoose");

const opts = {
    toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    privillages: Array,
}, opts);


// Create a virtual property `fullName` that's computed from `first_name`, `middle_name` and `last_name`.
userSchema.virtual('Password').get(function () {
    return `*******`;
});

const User = mongoose.model('User', userSchema);

module.exports = User;