'use strict';

const CartModel = require('../models/cart.model');
const objectId = require('../common/utils/objectId.util');
const cartStatus = require('../common/constants/cartStatus.constant');

const findCartById = async (cartId) => {
  return await CartModel.findOne({
    _id: objectId(cartId),
    status: cartStatus.activated,
  }).lean();
};

module.exports = { findCartById };
