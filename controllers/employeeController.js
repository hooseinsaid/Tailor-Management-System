const catchAsync = require("./../utils/catchAsync");
const Employee = require("../models/employeeModel");
const appError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")

exports.getAllEmployees = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Employee.find(), req.query).filter().sort().limitFields().paginate()
    const employees = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: employees.length,
        data: {
            employees,
        },
    });
});

exports.getEmployee = catchAsync(async (req, res, next) => {
    const employee = await Employee.findById(req.params.id);
    res.status(200).json({
        message: "Sucess",
        data: {
            employee
        },
    });
});

exports.createEmployee = catchAsync(async (req, res, next) => {

    const createdEmployee = await Employee.create(req.body);

    // Send Response
    res.status(201).json({
        status: "Success",
        data: {
            createdEmployee,
        },
    });
});

exports.updateEmployee = catchAsync(async (req, res, next) => {

    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    // if user does not exist send error
    if (!employee) {
        return next(new appError("no employee found with that ID", 404));
    }

    // Send Response
    res.status(200).json({
        status: "success",
        data: {
            employee
        },
    });
});

exports.deleteEmployee = catchAsync(async (req, res, next) => {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
        return next(new appError("no employee found with that ID", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
});


