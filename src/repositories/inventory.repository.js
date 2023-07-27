'use strict';

const objectId = require('../common/utils/objectId.util');

const inventoryModel = require('../models/inventory.model');

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknown',
}) => {
  return await inventoryModel.create({
    productId,
    shopId,
    stock,
    location,
  });
};

const inventoryReservation = async ({ productId, quantity, cartId }) => {
  const query = { productId: objectId(productId), stock: { $gte: quantity } },
    updateSet = {
      $inc: { stock: -quantity },
      $push: { reservations: { quantity, cartId, createTime: new Date() } },
    };

  return await inventoryModel.updateOne(query, updateSet);
};

module.exports = { insertInventory, inventoryReservation };
