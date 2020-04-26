const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const createSendToken = (user, statusCode, res, next) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_VALIDITY
  });

  if (!user.emailConfirmed) {
    res.status(200).json({
      status: 'error',
      issue: 'emailNotConfirmed',
      message:
        'A email confirmation has sent to your email. Please confirm to proceed furthure'
    });
  } else {
    res.status(200).json({
      status: 'success',
      token
    });
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    });
  }
};

const sendConfirmationEmail = catchAsync(async (user, req) => {
  const confirmationToken = await user.createToken('emailConfirmation');
  await user.save({ validateBeforeSave: false });
  const confirmationURL = `${req.protocol}://${req.hostname}/confirmEmail/${confirmationToken}`;

  await new Email(user, confirmationURL).sendAccountConfirmation();
});

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    photo: req.body.photo,
    address: req.body.address
  });

  // Send confirmation email
  sendConfirmationEmail(newUser, req);

  createSendToken(newUser, 200, res, next);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password exist
  if (!email || !password)
    return next(new AppError('Please provide email and password'));

  // Check if the email and password is correct, if correct sign the token
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 400));
  }

  createSendToken(user, 200, res, next);
});

// This is the function which checks whether the user is logged in or not,, and verify if the user is valid or not
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token if it exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('User is not logged in! Please login to get access', 401)
    );

  // 2) Validate token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to the token do not exist now', 400)
    );
  }

  // 4) Check if the user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password!! Please login again', 400)
    );
  }

  // 5) Grant access to protected routes
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// This function is used to restrict the access to particular users
exports.restrictAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `You don't have permission to access this. Please login as ${roles} to get access`
        ),
        403
      );
    }

    next();
  };
};

// Function to create the resetPasswword Token
exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user based on posted email
  const currentUser = await User.findOne({ email: req.body.email });
  if (!currentUser) {
    return next(new AppError('Please provide a valid email', 404));
  }

  // 2) Create the token
  const resetToken = await currentUser.createToken('passwordReset');

  await currentUser.save({ validateBeforeSave: false });
  // After creating the tokens in the middleware function we need to save it,, otherwise the token will not be persisted in database

  // 3) Send the Email

  const resetURL = `${req.protocol}://${req.hostname}:/resetPassword/${resetToken}`;
  try {
    await new Email(currentUser, resetURL).sendResetToken();

    res.status(200).json({
      status: 'success',
      message: `We have sent you a email. Please check it for resetting your password`
    });
  } catch (err) {
    return next(
      new AppError(
        'A problem occured while sending the email, please try again after sometime'
      ),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get the user based on token
  const hashedToken = await crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const currentUser = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!currentUser) {
    return next(new AppError('Reset token has expired or it is invalid', 403));
  }

  // If token is valid
  currentUser.password = req.body.password;
  currentUser.passwordConfirm = req.body.passwordConfirm;
  currentUser.passwordResetToken = undefined;
  currentUser.passwordResetExpires = undefined;
  await currentUser.save();
  // Will change the passwordChangedAt property using middleware in model-
  createSendToken(currentUser, 200, res, next);
});

exports.changePassword = catchAsync(async (req, res, next) => {
  // Get the data current password from the body
  const { currentPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user || !(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Incorrect email or password'));
  }

  user.password = newPassword;
  user.passwordConfirm = confirmPassword;
  await user.save();

  res.status(200).json({
    status: 'success'
  });
});

// FOR RENDERED PAGES,
// It will just check whether a user is logged in or not,, if yes,, res.locals.user will be assign with the logged in user data,,else move
exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // Get the no. of Cart Items before checking the req.cookies.jwt variable
  if (req.cookies.cart) {
    res.locals.cartItems = JSON.parse(req.cookies.cart).length;
  } else {
    res.locals.cartItems = 0;
  }
  if (req.cookies.jwt) {
    try {
      // 1) Get the token if it exist from the cookies
      // 2) Validate token
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      // 3) Check if user still exists
      const currentUser = await User.findById(decoded.id);

      // If user doesn't exist or token is invalid, than also don't create any error

      // 4) Check if the user changed password after token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // If it passes all this steps ,, means there is logged in user
      res.locals.user = currentUser;
      req.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
});

// Route when users clicks on logout
exports.logout = (req, res, next) => {
  res.cookie('jwt', undefined, {
    expires: new Date(Date.now() + 10 * 1000)
  });
  res.status(200).json({
    status: 'success'
  });
};
