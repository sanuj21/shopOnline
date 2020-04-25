const Booking = require('../models/bookingModel');
const handlerFunctions = require('./handlerFunctions');

exports.setProductId = (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  next();
};

exports.setUserId = (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.params.userId;
  }
  next();
};
exports.createBooking = handlerFunctions.createOne(Booking);
exports.getAllBookings = handlerFunctions.getAll(Booking);
exports.deleteBooking = handlerFunctions.deleteOne(Booking);
exports.getBooking = handlerFunctions.getOne(Booking);
exports.updateBooking = handlerFunctions.updateOne(Booking);
