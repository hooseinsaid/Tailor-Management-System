const catchAsync = require("./../utils/catchAsync");
const User = require("../models/userModel");
const appError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")
const bcrypt = require('bcrypt');


exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find().select("-password -__v"), req.query).filter().sort().limitFields().paginate()
  const users = await features.query;
  res.status(200).json({
    message: "Sucess",
    count: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password -__v");
  if (!user) {
    return next(new appError("No User Found with that ID", 400));
  }
  res.status(200).json({
    message: "Sucess",
    data: {
      user
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {

  // Encrypt password
  const plaintextPassword = req.body.password;
  const password = await bcrypt.hash(plaintextPassword, 10);

  // create user with encrypted password
  const createdUser = await User.create({ ...req.body, password });

  // Send Response
  res.status(201).json({
    status: "Success",
    data: {
      createdUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {

  // Encrypt password if password is in the fields
  const plaintextPassword = req.body.password;
  const password = plaintextPassword ? await bcrypt.hash(plaintextPassword, 10) : null;

  // body with encrypted password if password is in the fields
  const body = password ? { ...req.body, password } : req.body;

  // update user
  const user = await User.findByIdAndUpdate(req.params.id, body, {
    new: true,
    // runValidators: true,
  });

  // if user does not exist send error
  if (!user) {
    return next(new appError("no user found with that ID", 404));
  }

  // Send Response
  res.status(200).json({
    status: "success",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        privillages: user.privillages
      },
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new appError("no user found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.authenticateUser = catchAsync(async (req, res, next) => {

  // get username and password
  const username = req.query.username;
  const password = req.query.password;

  // if username or password is empty
  if (!username || !password) {
    return next(new appError("failed, username and password are required", 400))
  }

  // get user with username in the database
  const user = await User.findOne({ username });

  // if user does not exist send error
  if (!user) {
    return next(new appError("failed, incorrect username or password", 403))
  }

  // authenticate user by comparing the entered password and user password
  const authenticated = await bcrypt.compare(password, user.password);

  // if the passwords are not same send error
  if (!authenticated) {
    return next(new appError("failed, incorrect username or password", 403))
  }

  // send response
  res.status(200).json({
    status: "sucess",
    authenticated,
    user: {
      _id: user._id,
      name: user.name,
      username: user.username,
      password: user.Password,
      privillages: user.privillages
    },
  })

})
