const mongoose = require("mongoose");
const ContactSchema = require("../schema/ContactSchema");

const opts = {
    toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
}

const employeeSchema = mongoose.Schema({
    ...ContactSchema,
    employeeId: {
        type: Number,
        default: 1,
        unique: true
    },
    reg_date: {
        type: Date,
        default: new Date(),
    },
    role: {
        type: String
    },
    // salary: {
    //     type: Number
    // },
    status: {
        type: String,
    }
}, opts)

// Create a virtual property `fullName` that's computed from `first_name`, `middle_name` and `last_name`.
employeeSchema.virtual('fullName').get(function () {
    return `${this.first_name} ${this.middle_name} ${this.last_name}`;
});


// auto generate employee ID
employeeSchema.pre("validate", async function (next) {
    //sorting students
    const employees = await Employee.find({}).sort([["employeeId", -1]]);
    if (employees.length > 0) {
        this.employeeId = employees[0].employeeId + 1;
    }
    next();
});


const Employee = mongoose.model('employee', employeeSchema);

module.exports = Employee;
