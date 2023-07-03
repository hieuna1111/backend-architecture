'use strict';

const express = require('express');
const productController = require('../../../controllers/product.controller');
const { authentication } = require('../../../common/utils/auth.util');
const router = express.Router();

router.post('/', authentication, productController.createProduct);
router.post('/publish', authentication, productController.publishProduct);
router.post('/unPublish', authentication, productController.unPublishProduct);

router.get('/search', productController.searchProducts);
router.get('/draft', authentication, productController.getAllDraftProduct);
router.get('/publish', authentication, productController.getAllPublishProduct);

module.exports = router;
