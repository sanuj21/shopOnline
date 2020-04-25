const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const bookingRouter = require('./bookingRoutes');

const router = express.Router();
// This is a router module,, which defines routes in it and mounts all router on the path,, in the main app
router.use('/:userId/bookings', bookingRouter);

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/product/addToCart',
  authController.isLoggedIn,
  userController.addProductToCart
);

// Protect All router after this
router.use(authController.protect);

// router.get('/me', userController.getMe, userController.getUser);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/changePassword', authController.changePassword);

// Managing User addresses
router.patch('/addAddress', userController.addAddress);
router.patch('/updateAddress/:addressId', userController.updateAddress);
router.patch('/deleteAddress/:addressId', userController.deleteAddress);

//Managing Cart
router.get('/getCartProducts', userController.getCartProducts);
router.patch('/product/deleteFromCart', userController.deleteProductFromCart);
router.patch(
  '/product/updateProductCart/:productId',
  userController.updateProductCart
);

// Only admin can access below routes
router.use(authController.restrictAccess('admin'));

router.get('/', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);

module.exports = router;
