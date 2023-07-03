'use strict';

const { Types } = require('mongoose');
const { productModel } = require('../models/product.model');
const shopStatus = require('../common/constants/shopStatus.constant');
const { notFoundError } = require('../common/utils/handleError.util');

const searchProducts = async (keySearch) => {
  const regexSearch = new RegExp(keySearch);
  const products = await productModel
    .find(
      {
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
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
