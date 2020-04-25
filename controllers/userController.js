const mongoose = require('mongoose');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const handlerFunction = require('./handlerFunctions');
// This function updates the current user who is loggged in
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Show error if user tries to update password with this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You cannot update password with this route'));
  }

  // 2) Cause error if the user tries to change hi role
  if (req.body.role) {
    return next(
      new AppError(
        `You can't update your role,, you need to contact us to do so`,
        403
      )
    );
  }

  // 3) Update the user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    updatedUser
  });
});

// This user deletes the current user who is logged in,, actually it doesn't erase ,,rather it sets the active property to false
exports.deleteMe = catchAsync(async (req, res, next) => {
  // Find the user and set the active property to false

  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    return next(new AppError('Please login to get accessed', 403));
  }

  currentUser.active = false;
  currentUser.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'You are account is successfully deleted!!'
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.addAddress = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  // console.log(addedAddrUser, req.body.addressInfo);
  await user.address.push(req.body.addressInfo);

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success'
  });
});

exports.updateAddress = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user.id, 'address._id': req.params.addressId },
      { 'address.$': req.body.addressInfo }
    );

    res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { address: { _id: req.params.addressId } } }
    );

    res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.addProductToCart = async (req, res, next) => {
  try {
    const docStat = await User.updateOne(
      {
        _id: req.user.id,
        'cart.product': { $ne: mongoose.Types.ObjectId(req.body.product) }
      },
      { $push: { cart: req.body } }
    );
    if (docStat.nModified === 0) {
      return next(
        new AppError('This item is already there in your cart!', 400)
      );
    }

    res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProductFromCart = async (req, res, next) => {
  try {
    await User.updateOne(
      {
        _id: req.user.id
      },
      { $pull: { cart: { product: req.body.product } } }
    );

    res.status(200).json({
      status: 'success'
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateProductCart = async (req, res, next) => {
  try {
    await User.updateOne(
      {
        _id: req.user.id,
        'cart.product': req.params.productId
      },
      {
        'cart.$.quantity': req.body.quantity
      }
    );
  } catch (err) {
    console.log(err);
  }
};

exports.getCartProducts = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const cart = { ...user.cart };

    res.status(200).json({
      status: 'success',
      cart
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAllProductsFromCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save({ validateBeforeSave: false });
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.getAllUsers = handlerFunction.getAll(User);
exports.deleteUser = handlerFunction.deleteOne(User);
exports.getUser = handlerFunction.getOne(User);
