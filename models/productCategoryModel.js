const mongoose = require('mongoose');
const slugify = require('slugify');

const productCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Product Category should have a name']
  },
  slug: String,
  description: String,
  noOfSubCategories: {
    type: Number,
    default: 0
  },
  noOfProducts: {
    type: Number,
    default: 0
  }
});

// Pre Save Middleware
productCategorySchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  // Need to store the category and subcategory data in uniform manner
  next();
});

const ProductCategory = mongoose.model(
  'ProductCategory',
  productCategorySchema
);

module.exports = ProductCategory;
