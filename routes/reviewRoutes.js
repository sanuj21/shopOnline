const express = require('express');
const reviewController = require('../controllers/reviewController');
const util = require('../utils/util');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
// Here , we will implement nested routes to get, create, delete reviews on particular product

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(authController.protect, reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.protect,
    util.setUserIds,
    reviewController.deleteReview
  )
  .patch(
    authController.protect,
    util.setUserIds,
    reviewController.updateReview
  );

module.exports = router;
