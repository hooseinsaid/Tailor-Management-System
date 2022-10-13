const catchAsync = require("./../utils/catchAsync");
const Customer = require("../models/customerModel");
const Transaction = require("../models/transactionModel")
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Order = require("../models/orderModel");


exports.getAllCustomers = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Customer.find(), req.query).filter().sort().limitFields().paginate()
    const customers = await features.query;

    res.status(200).json({
        message: "Sucess",
        count: customers.length,
        data: {
            customers,
        },
    });
});

exports.getCustomersWithTransactions = catchAsync(async (req, res, next) => {

    const customers = await Customer.aggregate([
        {
            $lookup: {
                from: "transactions",
                localField: "_id",
                foreignField: "customer",
                as: "transactions"
            }
        },
        {
            $addFields: {
                debit: { $sum: "$transactions.debit" },
                credit: { $sum: "$transactions.credit" },
                balance: {
                    $subtract: [{ $sum: "$transactions.debit" }, { $sum: "$transactions.credit" }]
                }
            }
        },
    ]);

   
    res.status(200).json({
        message: "Sucess",
        count: customers.length,
        data: {
            customers,
        },
    });
});

exports.getCustomer = catchAsync(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);
    res.status(200).json({
        message: "Sucess",
        data: {
            customer
        },
    });
});

exports.createCustomer = catchAsync(async (req, res, next) => {
    
    const createdCustomer = await Customer.create(req.body)
    res.status(201).json({
        status: "Success",
        data: {
            createdCustomer,
        },
    });
});

exports.updateCustomer = catchAsync(async (req, res, next) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(201).json({
        status: "Success",
        data: {
            customer,
        },
    });
});

exports.getCustomerOrders = catchAsync(async(req,res,next)=>{
    const features = new APIFeatures(Order.find({customer: req.params.customerId}).populate("order"), req.query).filter().sort().limitFields().paginate()
    const orders = await features.query;
    res.status(200).json({
        status: "success",
        orders,
    })
})
