const AppError = require('../utils/appError');

const handleDublicateErrorDB = () => {
  const message = `Duplicate value. Please use another one`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = () => {
  return new AppError('Validation Failed!!', 400);
};

const sendErrorDev = (err, req, res) => {
  // When data is requested through api
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      err: err.status,
      errror: err,
      message: err.message,
      stack: err.stack
    });
  }
  // When page is requested
  else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!!',
      message: err.message
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // Operational Error, i.e. trusted error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Unknown Error
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.code === 11000) error = handleDublicateErrorDB();
    if (error.message === 'ValidationError') error = handleValidationErrorDB();

    sendErrorProd(error, req, res);
  }
};
