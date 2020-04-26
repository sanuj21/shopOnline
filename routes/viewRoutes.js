const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.setBaseVar, authController.isLoggedIn);
// Route when user searches something
router.get('/search/', viewsController.getSearchResults);

// Routes Related To User
router.get('/', viewsController.getOverview);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getSignupForm);
router.get('/forgetPassword', viewsController.getForgetPasswordForm);
router.get('/resetPassword/:resetToken', viewsController.getResetPasswordForm);
router.get('/myAccount', viewsController.getMyAccount);
router.get('/confirmEmail/:token', viewsController.confirmEmail);
router.get('/myAccount/cart', viewsController.getCartProductsGuest);

// Routes Related To Products
router.get('/products/:subCategorySlug', viewsController.getProducts);

router.get(
  '/products/:subCategorySlug/:productSlug',
  viewsController.getProduct
);

// All this routes can only be accessed by logged in users
// router.use(authController.protect);
router.get(
  '/myAccount/editAddress/:userAddressId',
  authController.protect,
  viewsController.getEditAddressForm
);

router.get(
  '/myAccount/cart/:userId',
  authController.protect,
  viewsController.getCartProducts
);

// When user is
router.get(
  '/myAccount/editAddress/:userAddressId/booking',
  authController.protect,
  viewsController.getEditAddressFormBooking
);

router.get(
  '/myAccount/editProfile',
  authController.protect,
  viewsController.getEditMyProfileForm
);
router.get(
  '/myAccount/changePassword',
  authController.protect,
  viewsController.getChangePasswordForm
);
router.get(
  '/myAccount/addAddress',
  authController.protect,
  viewsController.getAddAddressForm
);
router.get(
  '/myAccount/addAddress/booking',
  authController.protect,
  viewsController.getAddAddressFormBooking
);
router.get(
  '/myAccount/addresses',
  authController.protect,
  viewsController.getAddresses
);

router.get(
  '/myAccount/orders',
  authController.protect,
  viewsController.getMyOrders
);

router.get(
  '/myAccount/orders/:bookingId',
  authController.protect,
  viewsController.getMyOrderDetail
);

// For Choosing address from buy Button
router.get(
  '/products/bookProducts/chooseAddress/:subCategorySlug/:productSlug',
  authController.isLoggedIn,
  viewsController.getChooseAddress
);

// For Choosing address when coming from cart
router.get(
  '/products/bookProducts/cart/chooseAddress',
  authController.isLoggedIn,
  viewsController.getChooseAddress
);

router.get(
  '/products/bookProducts/cart/:addrIndex',
  authController.protect,
  viewsController.getBookingDetailsCart
);

// To signup for booking
router.get(
  '/products/bookProducts/chooseAddress/:subCategorySlug/:productSlug/signup',
  viewsController.getSignUpBooking
);

// For Choosing address when coming from cart as a guest
router.get(
  '/products/bookProducts/cart/chooseAddress/:userType',
  viewsController.getChooseAddress
);

router.get(
  '/products/bookProducts/cart/:userType/:addrIndex',
  authController.protect,
  viewsController.getBookingDetailsCart
);

router.get(
  '/products/bookProducts/:subCategorySlug/:productSlug/:addrIndex',
  authController.protect,
  viewsController.getBookingDetails
);

router.get(
  '/users/orderConfirmed',
  authController.protect,
  viewsController.getBookingConfirmedPage
);

module.exports = router;
