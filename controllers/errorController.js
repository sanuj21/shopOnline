const AppError = require('../utils/appError');

const handleDublicateErrorDB = error => {
  const message = `Already Exist!!!`;
  const statusCode = error.statusCode || 500;
  return new AppError(message, statusCode);
};

const handleValidationErrorDB = error => {
  const message = error.message || 'Validation Failed!!';
  const statusCode = error.statusCode || 400;
  return new AppError(message, statusCode);
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
    if (err.statusCode === 401) {
      return res.status(err.statusCode).render('login', {
        title: 'Login to Continue!!'
      });
    }
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!!',
      message: err.message
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // When data is requested through api
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      if (err.statusCode === 401) {
        return res.status(err.statusCode).render('login', {
          title: 'Login to Continue!!'
        });
      }

      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    // When page is requested
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!!',
      message: err.message
    });
  }

  // Operational Error, i.e. trusted error
  if (err.isOperational) {
    if (err.statusCode === 401) {
      return res.status(err.statusCode).render('login', {
        title: 'Login to Continue!!'
      });
    }

    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Unknown Error
  console.log(err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later!'
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

    if (error.code === 11000) error = handleDublicateErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProd(error, req, res);
  }
};
