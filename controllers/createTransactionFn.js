const Transaction = require("../models/transactionModel");
const Customer = require("../models/customerModel");
const AppError = require("../utils/appError");

async function createTransactionFn(transaction, req, res, next) {
  try {
    // get Customer with transaction Customer ID if customer
    const customer =
      transaction.customer &&
      (await Customer.findById(transaction.customer));

    
    // return error if  customer not found
    if ( !customer)
      return next(new AppError(" Customer or Vendor not found", 400));

    transaction.description = "Payment"
    // create transaction with Customer current balance
    const createdTransaction = await Transaction.create({
      ...transaction,
    });

    // return created transaction
    return {
      statusCode: 200,
      status: "success",
      message: "transactionn sucessfully created",
      treansaction: createdTransaction,
    };
  } catch (error) {
    // return error response
    return {
      isError: true,
      error: new AppError(error.message, error.statusCode)
    };
  }
}



module.exports = createTransactionFn;
