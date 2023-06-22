'use strict';

const express = require('express');
const productController = require('../../../controllers/product.controller');
const { authentication } = require('../../../common/utils/auth.util');
const router = express.Router();

router.post('/', authentication, productController.createProduct);

module.exports = router;
