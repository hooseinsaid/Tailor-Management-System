const catchAsync = require("./../utils/catchAsync");
const Order = require("../models/orderModel");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel")
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")
const justDate = require("../utils/justDate");

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Order.find({ status: { $ne: "cancelled" } }).populate({
        path: 'services',
        populate: {
            path: 'menu',
            model: 'Menu'
        }
    }).populate('customer').populate('servedUser'), req.query).filter().sort().limitFields().paginate()
    const orders = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: orders.length,
        data: {
            orders,
        },
    });
});

exports.getOrdersByDate = catchAsync(async (req, res, next) => {
    const startDate = `${new Date(req.params.startDate).getFullYear()}-${new Date(req.params.startDate).getMonth() + 1}-${new Date(req.params.startDate).getDate()}`;
    const endDate = `${new Date(req.params.endDate).getFullYear()}-${new Date(req.params.endDate).getMonth() + 1}-${new Date(req.params.endDate).getDate()}`;

    const features = new APIFeatures(Order.find({
        date: {
            $lte: new Date(endDate),
            $gte: new Date(startDate),
        },
        status: { $ne: "cancelled" }
    }).populate('customer'), req.query).filter().sort().limitFields().paginate();

    const orders = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: orders.length,
        data: {
            orders,
        },
    });
});

exports.getPendingOrders = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Order.find({ status: "pending" }).populate('customer'), req.query).filter().sort().limitFields().paginate()
    const orders = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: orders.length,
        data: {
            orders,
        },
    });
});

exports.getOnServiceOrders = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Order.find({ status: "on-service" }).populate('customer'), req.query).filter().sort().limitFields().paginate()
    const orders = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: orders.length,
        data: {
            orders,
        },
    });
});

exports.getFinishedOrders = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Order.find({ status: "finished" }).populate('customer'), req.query).filter().sort().limitFields().paginate()
    const orders = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: orders.length,
        data: {
            orders,
        },
    });
});

exports.getCancelledOrders = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Order.find({ status: "cancelled" }).populate('customer'), req.query).filter().sort().limitFields().paginate()
    const orders = await features.query;
    res.status(200).json({
        message: "Sucess",
        count: orders.length,
        data: {
            orders,
        },
    });
});

exports.takeOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new AppError("no order found with that ID", 404));
    }

    if (order.balance > 0) {
        return next(new AppError("to take order Balance must be Zero", 400))
    }

    if (order.status == 'taken') {
        return next(new AppError("this order allready taken", 404));
    }


    await Order.findByIdAndUpdate(req.params.id, { ...req.body, status: 'taken' }, {
        new: true,
        runValidators: true,
    });


    res.status(200).json({
        status: "success",
        data: {
            message: `succesfully taken `
        },
    });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new AppError("no order found with that ID", 404));
    }


    await Order.findByIdAndUpdate(req.params.id, { ...req.body, status: 'cancelled' }, {
        new: true,
        runValidators: true,
    });


    res.status(200).json({
        status: "success",
        data: {
            message: `Order Succesfully Cancelled `
        },
    });
});

exports.getOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('customer').populate('servedUser').populate({
        path: 'services',
        populate: {
            path: 'menu',
            model: 'Menu'
        }
    });
    res.status(200).json({
        message: "Sucess",
        data: {
            order
        },
    });
});

exports.createOrder = catchAsync(async (req, res, next) => {

    const createdOrder = await Order.create(req.body)

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

exports.payBill = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    const amount = req.params.amount;

    if (!order) {
        return next(new AppError("no order found with that ID", 404));
    }

    if (!amount) {
        return next(new AppError("Payment Amount is required", 400));
    }

    var payments = order.payments;

    payments.push({
        description: "Payment",
        amount: amount
    })

    await Order.findByIdAndUpdate(req.params.orderId, { ...req.body, payments: payments }, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "success",
        message: "payment Succesfully Compeleted"
    })
})

exports.invoiceOrderToCustomer = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    const user = req.params.user;

    console.log(req.params.id);
    console.log(req.params.user);
    if (!order) {
        return next(new AppError("no order found with that ID", 404));
    }

    if (order.status == 'invoiced') {
        return next(new AppError("this order allready invoiced", 404));
    }

    if (order.balance <= 0) {
        return next(new AppError("to invoice order Balace Must be greater than Zero", 400))
    }

    await Transaction.create({
        description: `Customer Invoice Order#${order.orderNumber}`,
        debit: order.balance,
        transactionType: "charge",
        customer: order.customer,
        user: req.params.user,

    });

    var payments = order.payments;

    payments.push({
        description: "Invoiced",
        amount: order.balance,
        user: user,
    })

    order.status = "invoiced";
    order.payments = payments;

    await Order.findByIdAndUpdate(req.params.id, order, {
        new: true,
        runValidators: true,
    });


    res.status(200).json({
        status: "success",
        data: {
            message: "Order Succesfully invoiced to customer"
        },
    });
});

exports.assignOrderToUser = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    const user = await User.findById(req.params.userId);


    if (!order) {
        return next(new AppError("no order found with that ID", 404));
    }
    if (!user) {
        return next(new AppError("no user found with that ID", 404));
    }

    if (order.status !== 'pending') {
        return next(new AppError("This is not Pending Order"))
    }

    await Order.findByIdAndUpdate(req.params.orderId, { servedUser: user._id, status: 'on-service' });


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

    await Order.findByIdAndUpdate(req.params.id, { ...req.body, status: 'finished' }, {
        new: true,
        runValidators: true,
    });


    res.status(200).json({
        status: "success",
        data: {
            message: `succesfully finished `
        },
    });
});

exports.getOnServiceOrdersByUser = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Order.find({ servedUser: req.params.userId, status: "on-service" }).populate('customer'), req.query).filter().sort().limitFields().paginate()
    const orders = await features.query;

    res.status(200).json({
        message: "Sucess",
        count: orders.length,
        data: {
            orders,
        },
    });
})




