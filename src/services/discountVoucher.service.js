'use strict';

const { get, map, reduce, includes } = require('lodash');
const objectId = require('../common/utils/objectId.util');
const { findProducts } = require('../repositories/product.repository');
const { throwBadRequest } = require('../common/utils/handleError.util');
const discountVoucherModel = require('../models/discountVoucher.model');
const {
  findAllDiscountCodesSelected,
} = require('../repositories/discountVoucher.repository');
const voucherType = require('../common/constants/voucherType.constant');

/**
 * 1. Generate discount code [owner | admin]
 * 2. Get discount amount [user]
 * 3. Get all discount codes [user | owner]
 * 4. Verify discount code [user]
 * 5. Delete discount code [admin | owner]
 * 6. Cancel discount code
 */

class DiscountVoucherService {
  static async createDiscountVoucherCode(payload) {
    const {
      code,
      startDate,
      endDate,
      shopId,
      minimumOrderValue,
      productIds,
      appliesToProductType,
      name,
      description,
      type,
      value,
      voucherNumber,
      numberUsedPerUser,
    } = payload;

    // TODO: create index for discount code
    const foundDiscountVoucher = await discountVoucherModel
      .findOne({
        code,
        shopId: objectId(shopId),
      })
      .lean();
    throwBadRequest(
      foundDiscountVoucher && get(foundDiscountVoucher, 'isActive'),
      'Discount exists'
    );

    const newDiscountVoucher = await discountVoucherModel.create({
      code,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      shopId,
      minimumOrderValue,
      productIds,
      appliesToProductType,
      name,
      description,
      type,
      value,
      voucherNumber,
      numberUsedPerUser,
    });
    return newDiscountVoucher;
  }

  static async updateDiscountVoucher() {}

  /**
   * Get products apply by discount code
   */
  static async getProductsApplyByDiscountCode({ shopId, code, limit, page }) {
    // TODO: create index for discount code
    const foundDiscountVoucher = await discountVoucherModel
      .findOne({
        code,
        shopId: objectId(shopId),
      })
      .lean();
    throwBadRequest(
      !foundDiscountVoucher || !get(foundDiscountVoucher, 'isActive'),
      'Not found discount voucher'
    );

    const { appliesToProductType, productIds } = foundDiscountVoucher;
    let products;
    if (appliesToProductType === 'all') {
      products = await findProducts({
        filter: {
          shopId: objectId(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['name'],
      });
    }

    if (appliesToProductType === 'specific') {
      // get products by productIds
      products = await findProducts({
        filter: {
          _id: { $in: map(productIds, (productId) => objectId(productId)) },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['name'],
      });
    }

    return products;
  }

  /**
   * Get list discount voucher code by shopId
   */
  static async getAllDiscountVoucherCodesForShop({ limit, page, shopId }) {
    const discountVouchers = await findAllDiscountCodesSelected({
      limit,
      page,
      filter: {
        shopId: objectId(shopId),
        isActive: true,
      },
      select: ['code', 'name'],
    });
    return discountVouchers;
  }

  static async getAmountAfterDiscountForProducts({ code, shopId, products }) {
    const foundDiscount = await discountVoucherModel.findOne({
      code,
      shopId: objectId(shopId),
    });
    throwBadRequest(
      !foundDiscount || !foundDiscount.isActive,
      'Discount voucher not found'
    );
    throwBadRequest(
      !get(foundDiscount, 'voucherNumber'),
      'Discount voucher sold out'
    );
    throwBadRequest(
      new Date() < new Date(foundDiscount.startDate) ||
        new Date() > new Date(foundDiscount.endDate),
      'Discount voucher expired'
    );

    let orderTotalAmount = 0;
    const minimumOrderValue = get(foundDiscount, 'minimumOrderValue', 0);
    if (minimumOrderValue > 0) {
      orderTotalAmount = reduce(
        products,
        (result, product) => {
          return (
            result + get(product, 'quantity', 0) * get(product, 'price', 0)
          );
        },
        0
      );
      throwBadRequest(
        orderTotalAmount < minimumOrderValue,
        'The total orders amount is not enough to apply the discount code'
      );
    }

    // const numberUsedPerUser = get(foundDiscount, 'numberUsedPerUser', 0);
    // const usersUsed = get(foundDiscount, 'usersUsed', []);
    // // TODO: refactor model discount voucher
    // if (numberUsedPerUser > 0) {
    //   // TODO:
    // }

    const reducedAmount =
      get(foundDiscount, 'type') === voucherType.fixAmount
        ? get(foundDiscount, 'value', 0)
        : orderTotalAmount * (get(foundDiscount, 'value', 0) / 100);

    return {
      orderTotalAmount,
      reducedAmount,
      totalPrice: orderTotalAmount - reducedAmount,
    };
  }

  static async deleteDiscountCode({ shopId, code }) {
    const deleted = await discountVoucherModel.findOneAndDelete({
      code,
      shopId: objectId(shopId),
    });
    return deleted;
  }

  static async cancelDiscountCode({ code, shopId, userId }) {
    const foundDiscountVoucher = await discountVoucherModel.findOne({
      code,
      shopId: objectId(shopId),
    });
    throwBadRequest(!foundDiscountVoucher, 'Discount voucher not found');

    const result = await discountVoucherModel.findByIdAndUpdate(
      foundDiscountVoucher._id,
      {
        $pull: {
          usersUsed: { userId },
        },
        $inc: {
          voucherNumber: 1, // +1 tong so luong ve phat hanh
          voucherNumberUsed: -1, // -1 ve da su dung
        },
      }
    );
    return result;
  }
}

module.exports = DiscountVoucherService;
