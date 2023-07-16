'use strict';

const express = require('express');
const productController = require('../../../controllers/product.controller');
const { authentication } = require('../../../common/utils/auth.util');
const router = express.Router();

router.route('/').post(authentication, productController.createProduct);

router.post('/publish', authentication, productController.publishProduct);
router.post('/unPublish', authentication, productController.unPublishProduct);

router.get('/search', productController.searchProducts);
router.get('/draft', authentication, productController.getAllDraftProduct);
router.get('/publish', authentication, productController.getAllPublishProduct);

router.patch('/:productId', authentication, productController.updateProduct);

router.post(
  '/amount-after-discount',
  productController.getAmountAfterDiscountForProducts
);

router.get(
  '/allowedToApplyDiscount',
  productController.getProductsApplyByDiscountCode
);

module.exports = router;
