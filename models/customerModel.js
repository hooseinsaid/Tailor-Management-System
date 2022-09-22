const mongoose = require("mongoose");
const ContactSchema = require("../schema/ContactSchema");

const opts = {
    toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}

const customerSchema = mongoose.Schema({
    ...ContactSchema,
    customerId: {
        type: Number,
        default: 1,
        unique: true
    },
    contact: {
        type: String
    },
    deadline: {
        type: Date
    }
}, opts)




// auto generate Customer ID
customerSchema.pre("validate", async function (next) {
    //sorting students
    const customers = await Customer.find({}).sort([["customerId", -1]]);
    if (customers.length > 0) {
        this.customerId = customers[0].customerId + 1;
    }
    next();
});


const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
