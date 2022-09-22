const catchAsync = require("./../utils/catchAsync");
const Order = require("../models/orderModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel")
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Order.find().populate('customer'), req.query).filter().sort().limitFields().paginate()
    const orders = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: orders.length,
        data: {
            orders,
        },
    });
});

exports.getOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    res.status(200).json({
        message: "Sucess",
        data: {
            order
        },
    });
});

exports.createOrder = catchAsync(async (req, res, next) => {

    const createdOrder = await Order.create(req.body);

    // Send Response
    res.status(201).json({
        status: "Success",
        data: {
            createdOrder,
        },
    });
});

exports.updateOrder = catchAsync(async (req, res, next) => {

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    // if user does not exist send error
    if (!order) {
        return next(new AppError("no order found with that ID", 404));
    }

    // Send Response
    res.status(200).json({
        status: "success",
        data: {
            order
        },
    });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
        return next(new AppError("no order found with that ID", 404));
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.invoiceOrderToCustomer = catchAsync(async (req, res, next) => {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
          return next(new AppError("no order found with that ID", 404));
      }

      if(order.status == 'invoiced' ){
        return next(new AppError("this order allready invoiced", 404));
      }

      await Transaction.create({
            description: `Customer Invoice Order#${order.orderNumber}`,
            debit: order.balance,
            transactionType: "charge",
            customer: order.customer
      });

      order.status= 'invoiced';
      await order.save();

      
      res.status(200).json({
          status: "success",
          data: {
            message: "Order Succesfully invoiced to customer"
          },
      });
});

exports.assignOrderToUser = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.ordrId);
    const user = await User.findById(req.params.userId);
    
    if (!order) {
        return next(new AppError("no order found with that ID", 404));
    }
    if (!user) {
        return next(new AppError("no user found with that ID", 404));
    }

    order.servedUser = user._id;
    await order.save();

    
    res.status(200).json({
        status: "success",
        data: {
          message: `Order successfully assigned to ${user.username}`
        },
    });
});

exports.finishOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new AppError("no order found with that ID", 404));
    }


    order.status = 'finished';
    await order.save();

    
    res.status(200).json({
        status: "success",
        data: {
          message: `succesfully finished `
        },
    });
});




