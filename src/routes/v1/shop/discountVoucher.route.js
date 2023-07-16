'use strict';

const express = require('express');
const discountVoucherController = require('../../../controllers/discountVoucher.controller');
const { authentication } = require('../../../common/utils/auth.util');
const router = express.Router();

router
  .route('/')
  .post(authentication, discountVoucherController.createDiscountCode)
  .get(
    authentication,
    discountVoucherController.getAllDiscountVoucherCodesForShop
  );

module.exports = router;
