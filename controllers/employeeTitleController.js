const catchAsync = require("./../utils/catchAsync");
const EmployeeTitle = require("../models/employeeTitleModel");

const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")

exports.getAllEmployeeTitles = catchAsync(async (req, res, next) => {
      const features = new APIFeatures(EmployeeTitle.find(), req.query).filter().sort().limitFields().paginate()
      const employeeTitles = await features.query;
      res.status(200).json({
            message: "Sucess",
            count: employeeTitles.length,
            data: {
                  employeeTitles,
            },
      });
});


exports.createEmployeeTitle = catchAsync(async (req, res, next) => {
      const createdEmployeeTitle = await EmployeeTitle.create(req.body)
      res.status(201).json({
            status: "Success",
            message: "Sucessfully Created!",
            data: {
                  createdEmployeeTitle,
            },
      });
});

exports.updateEmployeeTitle = catchAsync(async (req, res, next) => {
      const title = await EmployeeTitle.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
      }); res.status(201).json({
            status: "Success",
            message: "Sucessfully updated!",
            data: {
                  title,
            },
      });
});

exports.deleteEmployeeTitle = catchAsync(async (req, res, next) => {
      const employeeTitle = await EmployeeTitle.findByIdAndDelete(req.params.id);

      res.status(204).json({
            status: "success",
            data: null,
      });
});