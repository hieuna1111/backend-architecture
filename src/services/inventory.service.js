'use strict';

const objectId = require('../common/utils/objectId.util');
const { productModel } = require('../models/product.model');
const InventoryModel = require('../models/inventory.model');
const { throwBadRequest } = require('../common/utils/handleError.util');

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = 'Ha Noi, Viet Name',
  }) {
    const product = await productModel.findById(productId);
    throwBadRequest(!product, 'The product not exist');

    const query = { shopId: objectId(shopId), productId: objectId(productId) },
      updateSet = { $inc: { stock }, $set: { location } },
      options = { upsert: true, new: true };
    return await InventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
