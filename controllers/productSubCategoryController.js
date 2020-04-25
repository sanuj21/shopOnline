const ProductSubCategory = require('../models/productSubCategoryModel');
const handlerFunctions = require('./handlerFunctions');

exports.createProductSubCategory = handlerFunctions.createOne(
  ProductSubCategory
);
exports.getAllProductSubCategories = handlerFunctions.getAll(
  ProductSubCategory
);
exports.deleteProductSubCategory = handlerFunctions.deleteOne(
  ProductSubCategory
);
exports.updateProductSubCategory = handlerFunctions.updateOne(
  ProductSubCategory
);
exports.getProductSubCategory = handlerFunctions.getOne(ProductSubCategory);
