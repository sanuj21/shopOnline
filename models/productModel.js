// const express = require('express');
const mongoose = require('mongoose');
const slugify = require('slugify');
const ProductCategory = require('./productCategoryModel');
const ProductSubCategory = require('./productSubCategoryModel');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product should have a name']
    },
    slug: String,

    description: {
      type: String
    },
    brand: {
      type: String,
      required: [true, 'A product should have a brand']
    },
    images: [String],
    off: {
      type: Number,
      default: 0
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
      set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'any'],
      default: 'any'
    },
    colorAvailable: [String],
    sizeAvailable: [String],
    mrp: {
      type: Number,
      required: [true, 'A product should have a mrp']
    },

    specification: {
      material: String,
      fit: {
        type: String,
        enum: ['regular', 'slim'],
        default: 'regular'
      },
      machineWash: {
        type: Boolean,
        default: true
      },
      seller: String,
      ocassion: {
        type: String,
        default: 'Regular'
      }
    },
    productCategory: {
      type: mongoose.Schema.ObjectId,
      ref: 'ProductCategory',
      required: true
    },
    productSubCategory: {
      type: mongoose.Schema.ObjectId,
      ref: 'ProductSubCategory',
      required: true
    }
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.index({ sellingPrice: 1 });
productSchema.index({ ratingsAverage: -1 });

// Adding sellingPrice as a virtual field
productSchema.virtual('sellingPrice').get(function() {
  return Math.round(
    this.off === 0 ? this.mrp : this.mrp - (this.mrp / 100) * this.off
  );
  // If the off is = 0, then mrp is the sp otherwise it will be calculated
});

// Virtual Populate
// This function is used to populated a section named review in prouduct model, it is not persisted in DB, requested from reviews wherever needed
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id' // This means look for the review which has particular product Id
});

// Agrregate middleware to find no. of products
// We can add static methods to a schema in two ways,, first using the assign the function to statics object, and second call the static function
// I have do in both ways
//#### Not Working right now
productSchema.static('calcTotalProducts', async function(
  productCategoryId,
  productSubCategoryId
) {
  const statsSubCat = await this.aggregate([
    { $match: { productSubCategory: productSubCategoryId } },
    {
      $group: {
        _id: `$productSubCategory`,
        nProducts: { $sum: 1 }
      }
    }
  ]); // The first argument to aggregate funcition pipeline,, in which array contains,, aggregation commands

  const minPrice = await this.aggregate([
    {
      $match: { productSubCategory: productSubCategoryId }
    },
    {
      $group: {
        _id: `$productSubCategory`
      }
    },
    {
      $sort: { _id: 1 }
    },

    { $limit: 1 }
  ]);

  const statsCat = await this.aggregate([
    { $match: { productCategory: productCategoryId } },
    {
      $group: {
        _id: `$productCategory`,
        nProducts: { $sum: 1 }
      }
    }
  ]);

  if (statsSubCat.length > 0) {
    await ProductSubCategory.findByIdAndUpdate(productSubCategoryId, {
      noOfProducts: statsSubCat[0].nProducts
    });
  }

  if (statsCat.length > 0) {
    await ProductCategory.findByIdAndUpdate(productCategoryId, {
      noOfProducts: statsCat[0].nProducts
    });
  }
});

// Pre Save Middleware
productSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  // Need to store the category and subcategory data in uniform manner
  next();
});

// Post save Middleware
productSchema.post('save', async function(doc, next) {
  await this.constructor.calcTotalProducts(
    this.productCategory.id,
    this.productSubCategory.id
  );
  next();
});

// Populate on find
productSchema.pre(/^find/, async function(next) {
  this.populate({ path: 'productSubCategory', select: 'slug name' }).populate({
    path: 'productCategory',
    select: 'slug name'
  });
  next();
});

//On findOneAndDelete
productSchema.pre(/^findOneAnd/, async function(next) {
  this.productToDelUp = await this.findOne(); // Assining the deleted product to a variable , so that we can access later
  next();
});

productSchema.post(/^findOneAnd/, async function(doc, next) {
  if (this.productToDelUp) {
    this.productToDelUp.constructor.calcTotalProducts(
      this.productToDelUp.productCategory.id,
      this.productToDelUp.productSubCategory.id
    );
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
