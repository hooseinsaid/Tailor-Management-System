const mongoose = require("mongoose");

const opts = {
      toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
      }
}

const employeeTitleSchema = mongoose.Schema({
      title: {
            type: String,
            required: true,
            unique: true
      }
}, opts);



const EmployeeTitle = mongoose.model('EmployeeTitle', employeeTitleSchema);

module.exports = EmployeeTitle;