const catchAsync = require("../utils/catchAsync");
const Style = require("../models/styleModel");
const APIFeatures = require("../utils/apiFeatures")
const AppError = require("../utils/appError");

exports.getAllStyles = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Style.find(), req.query).filter().sort().limitFields().paginate()
  const styles = await features.query;
  res.status(200).json({
    message: "Sucess",
    count: styles.length,
    data: {
      styles,
    },
  });
});

exports.getStyle = catchAsync(async (req, res, next) => {
  const style = await Style.findById(req.params.id);
  res.status(200).json({
    message: "Sucess",
    data: {
      style,
    },
  });
});

exports.createStyle = catchAsync(async (req, res, next) => {
  const createdStyle = await Style.create(req.body);

  res.status(200).json({
    data: {
      createdStyle,
      message: "Style Successfully Created"
    },
  });
});

exports.updateStyle = catchAsync(async (req, res, next) => {
  const updatedStyle = await Style.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(201).json({
    status: "Success",
    data: {
      updatedStyle
    },
  });
})

exports.deleteStyle = catchAsync(async (req, res, next) => {
  const style = await Style.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    message: "Style Successfully Deleted",
    data: null,
  });
});



