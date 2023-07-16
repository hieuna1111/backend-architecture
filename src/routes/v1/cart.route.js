'use strict';

const express = require('express');
const CartController = require('../../controllers/cart.controller');
const { authentication } = require('../../common/utils/auth.util');
const router = express.Router();

router
  .route('')
  .get(CartController.listProductsInCart)
  .post(CartController.addToCart)
  .patch(CartController.updateCart)
  .delete(CartController.deleteProductInCart);

module.exports = router;
