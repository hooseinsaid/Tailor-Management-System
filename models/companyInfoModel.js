const mongoose = require("mongoose");

const opts = {
    toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}
const companyInfoSchema = mongoose.Schema({
    name: String,
    imageName: String,
    address: String,
    phone: Number,
    email: String,
}, opts);


const CompanyInfo = mongoose.model('CompanyInfo', companyInfoSchema, 'companyinfo');

module.exports = CompanyInfo;