'use strict';

const { Types } = require('mongoose');
const { uniqBy, map } = require('lodash');
const objectId = require('../common/utils/objectId.util');
const { productModel } = require('../models/product.model');
const shopStatus = require('../common/constants/shopStatus.constant');
const { notFoundError } = require('../common/utils/handleError.util');

// TODO: using redis to improve query
const searchProducts = async (keySearch) => {
  const query = { isPublished: true };

  if (!keySearch) {
    return await productModel.find(query).sort({ createdAt: -1 });
  }

  // full text search to search by description field in product model
  const fullTextQuery = { $text: { $search: new RegExp(keySearch, 'i') } };
  const meta = { score: { $meta: 'textScore' }, score: 0 };

  const fullTextResults = await productModel
    .find({ ...query, ...fullTextQuery }, meta)
    .sort(meta);

  const regexQuery = { name: { $regex: new RegExp(keySearch, 'i') } };

  const regexResults = await productModel.find({ ...query, ...regexQuery });

  return uniqBy([...fullTextResults, ...regexResults], 'id');
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

const updateProductById = async ({
  productId,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
};

const findProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await productModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();
};

const findProductsByProductIds = async (productIds) => {
  return await productModel.find({
    _id: { $in: map(productIds, (productId) => objectId(productId)) },
    isPublished: true,
  });
};

module.exports = {
  searchProducts,
  publishProduct,
  unPublishProduct,
  findAllDraftProducts,
  findAllPublishProducts,
  updateProductById,
  findProducts,
  findProductsByProductIds,
};
