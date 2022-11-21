const catchAsync = require("./../utils/catchAsync");
const Order = require("../models/orderModel");
const Service = require("../models/serviceModel");
const User = require("../models/userModel")
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")

exports.getAllServices = catchAsync(async (req, res, next) => {
      const features = new APIFeatures(Service.find({
            status: { $ne: "cancelled" }
      }).populate("menu").populate('order').populate('servedUser'),
            req.query
      ).filter().sort().limitFields().paginate()
      const services = await features.query;
      res.status(200).json({
            message: "Sucess",
            count: services.length,
            data: {
                  services,
            },
      });
});

exports.getService = catchAsync(async (req, res, next) => {
      const service = await Service.findById(req.params.id)
            .populate("menu").populate('order').populate('servedUser');
      res.status(200).json({
            message: "Sucess",
            data: {
                  service
            },
      });
});

exports.getPendingServices = catchAsync(async (req, res, next) => {
      const features = new APIFeatures(Service.find({ status: "pending" }).populate('order').populate({
            path: 'order',
            populate: {
                  path: 'customer',
                  model: 'Customer'
            }
      }).populate('menu'), req.query).filter().sort().limitFields().paginate();

      const orders = await features.query;

      res.status(200).json({
            message: "Sucess",
            count: orders.length,
            data: {
                  orders,
            },
      });
});

exports.createServices = catchAsync(async (req, res, next) => {
      // generate new order model, to get an unique id
      const order = new Order(req.body);

      // get the services add add order id in every service
      const services = req.body.services;
      services.forEach(service => {
            service.order = order.id;
      });

      // insert all the services in the database
      const createdServices = await Service.insertMany(services)

      // add the services in the body as refrence IDs
      let creatdServicesIds = [];
      createdServices.forEach(service => {
            creatdServicesIds.push(service._id);
      });

      req.body.services = creatdServicesIds;
      req.body._id = order.id;

      // next middle ware 
      next();
});

exports.updateService = catchAsync(async (req, res, next) => {

      const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
      });

      // if user does not exist send error
      if (!service) {
            return next(new AppError("no order found with that ID", 404));
      }

      // Send Response
      res.status(200).json({
            status: "success",
            data: {
                  service
            },
      });
});

exports.deleteService = catchAsync(async (req, res, next) => {
      const service = await Service.findByIdAndDelete(req.params.id);

      if (!service) {
            return next(new AppError("no order found with that ID", 404));
      }
      res.status(204).json({
            status: "success",
            data: null,
      });
});


exports.assignServiceToUser = catchAsync(async (req, res, next) => {
      const service = await Service.findById(req.params.serviceId);
      const user = await User.findById(req.params.userId);


      if (!service) {
            return next(new AppError("no service found with that ID", 404));
      }
      if (!user) {
            return next(new AppError("no user found with that ID", 404));
      }

      if (service.status !== 'pending') {
            return next(new AppError("This is not Pending Service"))
      }

      await Service.findByIdAndUpdate(req.params.serviceId, { servedUser: user._id, status: 'on-service' });


      res.status(200).json({
            status: "success",
            data: {
                  message: `Service successfully assigned to ${user.username}`
            },
      });
});

exports.finishService = catchAsync(async (req, res, next) => {
      const service = await Service.findById(req.params.id);

      if (!service) {
            return next(new AppError("no service found with that ID", 404));
      }

      await Service.findByIdAndUpdate(req.params.id, { ...req.body, status: 'finished' }, {
            new: true,
            runValidators: true,
      });


      res.status(200).json({
            status: "success",
            data: {
                  message: `Service succesfully finished `
            },
      });
});

exports.getOnServiceServicesByUser = catchAsync(async (req, res, next) => {
      const features = new APIFeatures(Service.find({
            servedUser: req.params.userId,
            status: "on-service"
      }).populate('order').populate({
            path: 'order',
            populate: {
                  path: 'customer',
                  model: 'Customer'
            }
      }).populate({
            path: 'order',
            populate: {
                  path: 'services',
                  model: 'Service'
            }
      }).populate('menu'), req.query).filter().sort().limitFields().paginate()
      const services = await features.query;

      res.status(200).json({
            message: "Sucess",
            count: services.length,
            data: {
                  services,
            },
      });
});




