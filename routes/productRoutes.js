const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:productId/reviews', reviewRouter);

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictAccess('admin'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .delete(
    authController.protect,
    authController.restrictAccess('admin'),
    productController.deleteProduct
  )
  .patch(
    authController.protect,
    authController.restrictAccess('admin'),
    productController.updateProduct
  );

module.exports = router;
