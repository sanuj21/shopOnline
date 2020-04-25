const express = require('express');
const productSubCategoryController = require('../controllers/productSubCategoryController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(productSubCategoryController.getAllProductSubCategories)
  .post(
    authController.protect,
    authController.restrictAccess('admin'),
    productSubCategoryController.createProductSubCategory
  );

router
  .route('/:id')
  .get(productSubCategoryController.getProductSubCategory)
  .delete(
    authController.protect,
    authController.restrictAccess('admin'),
    productSubCategoryController.deleteProductSubCategory
  )
  .patch(
    authController.protect,
    authController.restrictAccess('admin'),
    productSubCategoryController.updateProductSubCategory
  );

module.exports = router;
