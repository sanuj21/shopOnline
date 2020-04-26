// const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A user should have a name']
    },
    email: {
      type: String,
      required: [true, 'A user should have a email'],
      unique: [
        true,
        'This email address already exists. Please login or user another one'
      ],
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    image: String,
    password: {
      type: String,
      required: [true, 'A user should have a Password'],
      minlength: [6, 'Password should be at least of 6 characters'],
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm the password'],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords do not match'
      }
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'seller'],
      default: 'user'
    },
    emailConfirmed: {
      type: Boolean,
      default: false
    },
    address: [
      {
        name: String,
        houseNo: String,
        street: String,
        locality: String,
        city: String,
        pincode: String,
        district: String,
        state: String,
        country: String,
        mobileNo: String
      }
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product'
        },
        quantity: Number
      }
    ],
    active: {
      type: Boolean,
      default: true
    },
    createdOn: {
      type: Date,
      default: Date.now(),
      select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailConfirmationToken: String
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual Populate
// This function is used to populated a section named booking in user model,
//## Not working for now
// userSchema.virtual('bookings', {
//   ref: 'Booking',
//   foreignField: 'user',
//   localField: '_id' // This means look for the review which has particular product Id
// });

// Pre middleware
// The encryption of the password is done here
userSchema.pre('save', async function(next) {
  // Only hash password only if it is modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  // The second argument is the saltRound that,, how much time require to encrypt,, adding 1 means doubling the time
  // The more value ,, the more time for bruteforcing
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function(next) {
  // If the password is not change or if it is new then return the function as it is
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// This middle runs before the find query runs
userSchema.pre(/^find/, async function(next) {
  this.find({ active: { $ne: 'false' } });
  next();
});

// Checks if the user has entered the correct password
userSchema.methods.correctPassword = async (inputPassword, userPassword) => {
  return await bcrypt.compare(inputPassword, userPassword);
};

// Make the user login again if he changes his password

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt / 1000, 10);

    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createToken = async function(str) {
  // This function is creating a random 64 characters string
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = await crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  if (str === 'passwordReset') {
    // This is used to hash the string
    this.passwordResetToken = hashedToken;
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    // Means 1000 * 60 means,, 60 sec i,e 1 min and * 10 means 10 min
    // So the token will expire in 10 minutes
  } else if (str === 'emailConfirmation') {
    this.emailConfirmationToken = hashedToken;
  }
  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
