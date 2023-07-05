'use strict';

const { Types } = require('mongoose');
const { productModel } = require('../models/product.model');
const shopStatus = require('../common/constants/shopStatus.constant');
const { notFoundError } = require('../common/utils/handleError.util');

const searchProducts = async (keySearch) => {
  const query = { isPublished: true };
  const meta = {};
  if (keySearch) {
    query.$text = { $search: new RegExp(keySearch) };
    meta.score = { $meta: 'textScore' };
  }
  const products = await productModel.find(query, meta).sort(meta).lean();
  return products;
};

const publishProduct = async ({ shopId, productId }) => {
  const foundProduct = await productModel.findOne({
    _id: new Types.ObjectId(productId),
    shopId: new Types.ObjectId(shopId),
  });
  notFoundError(!foundProduct, 'Not found product');

  foundProduct.isDraft = false;
  foundProduct.isPublished = true;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const unPublishProduct = async ({ shopId, productId }) => {
  const foundProduct = await productModel.findOne({
    _id: new Types.ObjectId(productId),
    shopId: new Types.ObjectId(shopId),
  });
  notFoundError(!foundProduct, 'Not found product');

  foundProduct.isDraft = true;
  foundProduct.isPublished = false;

  const { modifiedCount } = await foundProduct.updateOne(foundProduct);
  return modifiedCount;
};

const _queryProductByStatus = async ({ query, limit, skip }) => {
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

const findAllDraftProducts = async ({ query, limit, skip }) => {
  return await _queryProductByStatus({ query, limit, skip });
};

const findAllPublishProducts = async ({ query, limit, skip }) => {
  return await _queryProductByStatus({ query, limit, skip });
};

module.exports = {
  searchProducts,
  publishProduct,
  unPublishProduct,
  findAllDraftProducts,
  findAllPublishProducts,
};
