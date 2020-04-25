const express = require('express');
const productCategoryController = require('../controllers/productCategoryController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(productCategoryController.getAllProductCategories)
  .post(
    authController.protect,
    authController.restrictAccess('admin'),
    productCategoryController.createProductCategory
  );

router
  .route('/:id')
  .get(productCategoryController.getProductCategory)
  .delete(
    authController.protect,
    authController.restrictAccess('admin'),
    productCategoryController.deleteProductCategory
  )
  .patch(
    authController.protect,
    authController.restrictAccess('admin'),
    productCategoryController.updateProductCategory
  );

module.exports = router;
