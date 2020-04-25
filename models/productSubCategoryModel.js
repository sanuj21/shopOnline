const mongoose = require('mongoose');
const slugify = require('slugify');
const ProductCategory = require('./productCategoryModel');

const productSubCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Product  should have a name']
  },
  description: String,
  slug: String,

  productCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductCategory'
  },
  noOfProducts: {
    type: Number,
    default: 0
  },
  image: {
    type: String
  }
});

// Function to calculate no. of subcategoires
productSubCategorySchema.static('calcNoOfSubCategories', async function(
  productCategoryId
) {
  const stats = await this.aggregate([
    {
      $match: { productCategory: productCategoryId }
    },
    {
      $group: {
        _id: '$productCategory',
        nSubCategories: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await ProductCategory.findByIdAndUpdate(productCategoryId, {
      noOfSubCategories: stats[0].nSubCategories
    });
  }
});

// Pre Save Middleware
productSubCategorySchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  // Need to store the category and subcategory data in uniform manner
  next();
});

// On creating and deleting a subcategories ,, we want to update it in categories model
productSubCategorySchema.post('save', async function(doc, next) {
  await this.constructor.calcNoOfSubCategories(this.productCategory);
  next();
});

// On findOneAndDelete
productSubCategorySchema.pre(/findOneAndDelete/, async function(next) {
  this.subCategoryToDelete = await this.findOne();
  next();
});

productSubCategorySchema.post(/findOneAndDelete/, async function(doc, next) {
  if (this.subCategoryToDelete) {
    this.subCategoryToDelete.constructor.calcNoOfSubCategories(
      this.subCategoryToDelete.productCategory
    );
  }
  next();
});

const ProductSubCategory = mongoose.model(
  'ProductSubCategory',
  productSubCategorySchema
);

module.exports = ProductSubCategory;
