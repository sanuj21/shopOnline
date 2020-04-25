const express = require('express');
const bookingController = require('../controllers/bookingController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(
  authController.protect,
  authController.restrictAccess('user', 'admin')
);

router
  .route('/')
  .get(bookingController.setUserId, bookingController.getAllBookings)
  .post(bookingController.setUserId, bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.setUserId, bookingController.getBooking)
  .delete(bookingController.setUserId, bookingController.deleteBooking)
  .patch(bookingController.updateBooking);

module.exports = router;
