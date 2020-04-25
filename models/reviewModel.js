const mongoose = require('mongoose');
const product = require('./productModel');

const reviewSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A review should have title']
    },
    description: {
      type: String
    },
    rating: {
      type: Number,
      min: [1, `Rating can't be less than 1`],
      max: [5, `Rating can't be more than 5`],
      default: 4
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, `A review must have a productId`]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, `A review must have a userId`]
    },
    createdOn: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Verify whether the same user is not giving the review on same product again
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Populating the user
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user'
  });
  next();
});

// This aggregation middleware is used to calculate the average rating
reviewSchema.statics.calcAverageRatings = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId }
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await product.findByIdAndUpdate(productId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating
    });
  }
};

// This function will update the avgRating, wherever there will be new review
reviewSchema.post('save', async function() {
  await this.constructor.calcAverageRatings(this.product);
  // We can't use Review Model here, because it is not decalred yet, so we use constructor
});

// In document middleware, this refers to the document ,, but in query middleare this refers to the query itself
// findByIdAnd -> internally findOneAnd
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.reviewToUpdate = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // Here we can't use this.findOne() because the query has been executed
  if (this.reviewToUpdate) {
    await this.reviewToUpdate.constructor.calcAverageRatings(
      this.reviewToUpdate.product
    );
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
