const ProductCategory = require('../models/productCategoryModel');
const handlerFunctions = require('./handlerFunctions');

exports.createProductCategory = handlerFunctions.createOne(ProductCategory);
exports.getAllProductCategories = handlerFunctions.getAll(ProductCategory);
exports.deleteProductCategory = handlerFunctions.deleteOne(ProductCategory);
exports.updateProductCategory = handlerFunctions.updateOne(ProductCategory);
exports.getProductCategory = handlerFunctions.getOne(ProductCategory);
