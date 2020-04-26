const mongoose = require('mongoose');
const crypto = require('crypto');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const ProductCategory = require('../models/productCategoryModel');
const ProductSubCategory = require('../models/productSubCategoryModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.setBaseVar = catchAsync(async (req, res, next) => {
  res.locals.productCategory = await ProductCategory.find();
  res.locals.productSubCategory = await ProductSubCategory.find();
  next();
});

exports.getOverview = catchAsync(async (req, res, next) => {
  res.status(200).render('overview', {
    title: `itMatters - India's best online fashion store`
  });
});

exports.getProducts = catchAsync(async (req, res, next) => {
  const productSubCategorySpecfic = await ProductSubCategory.findOne({
    slug: req.params.subCategorySlug
  });

  const products = await Product.find({
    productSubCategory: productSubCategorySpecfic._id
  });

  res.status(200).render('productList', {
    title: `Showing result of ${productSubCategorySpecfic.name}`,
    products
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({
    slug: req.params.productSlug
  }).populate('reviews');

  res.status(200).render('productDetail', {
    title: product.name,
    product
  });
});

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'itMatters - Log into your account'
  });
};

exports.getSignupForm = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'itMatters - Create an account'
  });
};

exports.getMyAccount = (req, res, next) => {
  res.status(200).render('myAccount', {
    title: 'My Account'
  });
};

exports.getEditMyProfileForm = (req, res, next) => {
  res.status(200).render('editProfile', {
    title: 'Update My Profile'
  });
};

// When the User is logged in
exports.getChangePasswordForm = (req, res, next) => {
  res.status(200).render('changePassword', {
    title: 'Change My Password'
  });
};

// When user has foregotton his password
exports.getForgetPasswordForm = (req, res, next) => {
  res.status(200).render('forgetPasswordForm', {
    title: 'Forgot Your Password'
  });
};

// Password reset Form
exports.getResetPasswordForm = (req, res, next) => {
  res.status(200).render('changePassword', {
    title: 'Reset My Password',
    resetToken: req.params.resetToken
  });
};

exports.getAddAddressForm = (req, res, next) => {
  res.status(200).render('addAddress', {
    title: 'Add a new Address'
  });
};

exports.getAddAddressFormBooking = (req, res, next) => {
  res.status(200).render('addAddress', {
    title: 'Add a new Address',
    status: 'booking'
  });
};

exports.getAddresses = (req, res, next) => {
  res.status(200).render('addresses', {
    title: 'My Addresses'
  });
};

exports.getEditAddressForm = (req, res, next) => {
  res.status(200).render('editAddress', {
    title: 'Update Your Address',
    addressId: req.params.userAddressId
  });
};

exports.getEditAddressFormBooking = (req, res, next) => {
  res.status(200).render('editAddress', {
    title: 'Update Your Address',
    addressId: req.params.userAddressId,
    status: 'booking'
  });
};

exports.getBookingDetails = catchAsync(async (req, res, next) => {
  // // This means that the user is not logged in, than redirect him to login form
  // if (!req.user) {
  //   return res.status(200).render('login', {
  //     title: 'Login',
  //     status: 'booking'
  //   });
  // }

  const product = await Product.findOne({
    slug: req.params.productSlug
  });
  const addressArrIndex = Number(req.params.addrIndex);

  res.status(200).render('bookingDetails', {
    title: 'Preparing Your Order',
    product,
    addressArrIndex
  });
});

const assignCart = async (req, res, next, title, route) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'cart.product'
    });

    let addressArrIndex;
    if (req.params.addrIndex) {
      addressArrIndex = Number(req.params.addrIndex);
    }

    const products = [];

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < user.cart.length; i++) {
      user.cart[i].product.quantity = user.cart[i].quantity;
      products[i] = user.cart[i].product;
    }

    // ## We don't need to find specfic subcategory , because it is populated in the product
    // let subCatIds = [];
    // for (let i = 0; i < products.length; i++) {
    //   subCatIds[i] = products[i].productSubCategory;
    // }

    // const productsSpecificSubCat = await ProductSubCategory.find({
    //   _id: {
    //     $in: subCatIds
    //   }
    // });

    // // Check if the page is booking details,, than if address doesn't exist, redirect to add address page
    // if (route === 'bookingDetails' && user.address.length < 1) {
    //   return res.status(200).render(`addAddress`, {
    //     title: 'Add a address',
    //     status: 'booking'
    //   });
    // }

    res.status(200).render(`${route}`, {
      title: `${title}`,
      products,
      user,
      addressArrIndex // Only needed in the bookingDetails page
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCartProducts = catchAsync(async (req, res, next) => {
  await assignCart(req, res, next, 'My Cart', 'cart');
});

exports.getBookingDetailsCart = catchAsync(async (req, res, next) => {
  if (req.params.userType === 'guest') {
    const cartArr = JSON.parse(req.cookies.cart);
    res.cookie('cart', undefined, {
      expires: new Date(Date.now() + 10 * 1000)
    });

    // Empty the cart in user
    await User.updateOne(
      {
        _id: req.user.id
      },
      {
        $set: { cart: [] }
      }
    );

    // Add the cookies products to cart
    await User.updateOne(
      {
        _id: req.user.id,
        'cart.product': { $ne: mongoose.Types.ObjectId(req.body.product) }
      },
      { $push: { cart: cartArr } }
    );
  }

  await assignCart(req, res, next, 'Preparing your order', 'bookingDetails');
});

exports.getBookingConfirmedPage = catchAsync(async (req, res, next) => {
  res.status(200).render('confirmed', {
    title: 'Your Order has been Confirmed!!',
    status: 'order'
  });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate({
    path: 'product.productId',
    select: 'name sellingPrice off mrp images productSubCategory'
  });

  res.status(200).render('myOrders', {
    title: 'Your Orders',
    bookings
  });
});

exports.getMyOrderDetail = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.bookingId).populate(
    'product.productId'
  );

  res.status(200).render('orderDetail', {
    title: 'Your Orders',
    booking
  });
});

exports.getChooseAddress = catchAsync(async (req, res, next) => {
  if (!req.user) {
    if (req.params.userType === 'guest') {
      return res.status(200).render('login', {
        title: 'Login to Continue',
        status: 'booking'
      });
    }
    return res.status(200).render('login', {
      title: 'Login to Continue',
      status: 'booking',
      cur_url: req.url
    });
  }
  // await User.findById(req.user.id);
  // It checks whether a logged user has atleast one address or not, if not make him add one
  // Its not needed now,, because user can add and edit address whilte choosing
  // if (user.address.length < 1) {
  //   return res.status(200).render('addAddress', {
  //     title: 'Add a Address',
  //     status: 'booking'
  //   });
  // }

  res.status(200).render('addresses', {
    title: 'Choose a Delivery Address',
    status: 'booking'
  });
});

// Get Cart Project for non logged in user
exports.getCartProductsGuest = catchAsync(async (req, res, next) => {
  let products = [];
  if (req.cookies.cart) {
    const cartArr = JSON.parse(req.cookies.cart);

    const productIdArr = [];
    for (let i = 0; i < cartArr.length; i++) {
      productIdArr[i] = cartArr[i].product;
    }

    products = await Product.find({
      _id: { $in: productIdArr }
    });

    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < productIdArr.length; j++) {
        if (productIdArr[j] === products[i].id) {
          products[i].quantity = cartArr[j].quantity;
          break;
        }
      }
    }
  }
  res.status(200).render('cart', {
    title: 'My Cart',
    products
  });
});

exports.getSignUpBooking = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'itMatters - Create an account',
    status: 'booking'
  });
};

// Making the small and basic search functionality
// Get Search Results
exports.getSearchResults = catchAsync(async (req, res, next) => {
  const searchQuery = req.query.searchStr;
  let refineQ = searchQuery.split(' ')[0];
  // Removing the s from end e.g tshirts -> tshirt
  if (refineQ.charAt(refineQ.length - 1) === 's') {
    refineQ = refineQ.substring(0, refineQ.length - 1);
  }
  const re = new RegExp(refineQ.replace('-', ''), 'gi');
  const products = await Product.find({
    $or: [{ name: { $regex: re } }]
  });

  res.status(200).render('productList', {
    title: `Showing results for ${searchQuery}`,
    products,
    searchQuery
  });
});

// Confirm Email check token

exports.confirmEmail = catchAsync(async (req, res, next) => {
  // Get the user based on token
  const hashedToken = await crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({ emailConfirmationToken: hashedToken });

  if (!user) {
    return next(
      new AppError('This token is invalid! Please get a new token', 400)
    );
  }

  user.emailConfirmed = true;
  user.emailConfirmationToken = undefined;

  await user.save({ validateBeforeSave: false });

  res.render('confirmed', {
    title: 'Your Email has been confirmed!!',
    status: 'email'
  });
});
