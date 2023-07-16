'use strict';

const catchAsync = require('../common/helpers/catchAsync.helper');
const {
  createdResponse,
  okResponse,
} = require('../common/utils/handleSuccess.util');
const CartService = require('../services/cart.service');

class CartController {
  addToCart = catchAsync(async (req, res) => {
    const data = await CartService.addToCart(req.body);
    createdResponse({
      res,
      message: 'Added to cart successfully',
      metadata: data,
    });
  });

  updateCart = catchAsync(async (req, res) => {
    const data = await CartService.updateCart(req.body);
    okResponse({
      res,
      message: 'Updated cart successfully',
      metadata: data,
    });
  });

  deleteProductInCart = catchAsync(async (req, res) => {
    const data = await CartService.deleteProductInCart(req.body);
    okResponse({
      res,
      message: 'Deleted product in cart successfully',
      metadata: data,
    });
  });

  listProductsInCart = catchAsync(async (req, res) => {
    const data = await CartService.listProductsInCart(req.query);
    okResponse({
      res,
      message: 'Get list products in cart successfully',
      metadata: data,
    });
  });
}

module.exports = new CartController();
