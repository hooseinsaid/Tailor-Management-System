const AppError = require("../utils/appError");

const handleCastErrorDB = (err, res) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(new AppError(message, 400), res);
  } else if (process.env.NODE_ENV == 'production') {
    sendErrorProd(new AppError(message, 400), res);
  }
}

const handleDuplicateFieldsDB = (err, res) => {

  const value = err.keyValue.name || err.keyValue.email;
  const message = `${value} is not availibe, please use an other one`;
  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(new AppError(message, 400), res);
  } else if (process.env.NODE_ENV == 'production') {
    sendErrorProd(new AppError(message, 400), res);
  }
}



const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error("Error ", err);
    res.status(500).json({
      status: 'error',
      message: "something went very wrong"
    })
  }
};

module.exports = (err, req, res, next) => {
  // const statusCode = err.statusCode || 500;
  // const status = err.status || 'error';

  if (process.env.NODE_ENV == 'development') {
    sendErrorDev(err, res);
    // } else if (process.env.NODE_ENV == 'production') {
  } else {

    let error = { ...err };

    if (error.code === 11000) error = handleDuplicateFieldsDB(error, res);

    if (error.name === "CastError") error = handleCastErrorDB(error, res);

    sendErrorProd(err, res);
  }
};