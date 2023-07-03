'use strict';

const {
  productModel,
  clothingModel,
  electronicModel,
  furnitureModel,
} = require('../models/product.model');
const shopStatus = require('../common/constants/shopStatus.constant');

const findAllDraftProductsForShop = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate({
      path: 'shopId',
      match: { status: shopStatus.active },
    })
    .sort({ updated: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

module.exports = { findAllDraftProductsForShop };
