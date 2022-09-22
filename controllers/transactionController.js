const catchAsync = require("../utils/catchAsync");
const Transaction = require("../models/transactionModel");
const createTransactionFn = require("./createTransactionFn")
const APIFeatures = require("../utils/apiFeatures")
const AppError = require("../utils/appError");

exports.getAllTransaction = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Transaction.find().populate('customer').populate("order"), req.query).filter().sort().limitFields().paginate()
  const transactions = await features.query;
  res.status(200).json({
    message: "Sucess",
    count: transactions.length,
    data: {
      transactions,
    },
  });
});

exports.getTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id);
  res.status(200).json({
    message: "Sucess",
    data: {
      transaction,
    },
  });
});

exports.getTransaction = catchAsync(async (req, res, next) => {
  const transactionId = req.params.transactionId;
  const transaction = await Transaction.findOne({ transactionId });
  res.json({
    status: "success",
    transaction
  })
});

exports.createTransaction = catchAsync(async (req, res, next) => {
  const response = await createTransactionFn(req.body, req, res, next);

  if (response.isError) {
    return next(response.error)
  }

  res.status(response.statusCode).json({
    response,
  });
});

exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    message: "Transaction Successfully Deleted",
    data: null,
  });
});



