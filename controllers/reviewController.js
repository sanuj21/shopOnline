const Review = require('../models/reviewModel');
const handlerFunctions = require('./handlerFunctions');

exports.createReview = handlerFunctions.createOne(Review);
exports.getAllReviews = handlerFunctions.getAll(Review);
exports.getReview = handlerFunctions.getOne(Review);
exports.deleteReview = handlerFunctions.deleteOne(Review);
exports.updateReview = handlerFunctions.updateOne(Review);
