const AppError = require('../utils/appError');

// ===> Development mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });
};

// ===> Production mode
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  if (!err.isOperational) {
    res.status(500).json({
      status: 'error',
      message: 'Somthing went wrong!',
    });
  }
};

const handleValidationError = (err) => {
  const customError = Object.values(err.errors)
    .map((val) => val.message)
    .join(', ');

  const message = `Invalid input data. ${customError}`;

  return new AppError(message, 400);
};

const handleDuplicateKeysDB = (err) => {
  const value = Object.keys(err.keyValue).join(', ');
  const message = `Duplicate field value: ${value}. Pleas use another value!`;

  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message };

    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.code === 11000) error = handleDuplicateKeysDB(error);

    sendErrorProd(error, res);
  }
};
