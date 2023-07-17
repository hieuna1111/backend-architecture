'use strict';

const express = require('express');
const CheckoutController = require('../../controllers/checkout.controller');
const router = express.Router();

router.post('/preview', CheckoutController.checkoutPreview);

module.exports = router;
