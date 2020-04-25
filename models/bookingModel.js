// const express = require('express');
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  product: [
    {
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'A booking should have atleast one product']
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A booking should have a user']
  },
  address: { type: mongoose.Schema.ObjectId, ref: 'User.Address' },
  bookedOn: {
    type: Date,
    default: Date.now()
  },
  expectedDelivery: {
    type: Date,
    default: Date.now() + 1000 * 60 * 60 * 24 * 2
  },
  status: {
    type: String,
    enum: ['delivered', 'processing', 'cancelled'],
    default: 'processing'
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
