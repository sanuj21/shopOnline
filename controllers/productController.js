const Product = require('../models/productModel');
const handlerFunctions = require('./handlerFunctions');

exports.createProduct = handlerFunctions.createOne(Product);
exports.getAllProducts = handlerFunctions.getAll(Product);
exports.deleteProduct = handlerFunctions.deleteOne(Product);
exports.updateProduct = handlerFunctions.updateOne(Product);
exports.getProduct = handlerFunctions.getOne(Product, { path: 'reviews' });
