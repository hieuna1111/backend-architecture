'use strict';

const { flatMap, keyBy, get, forEach, reduce, map } = require('lodash');
const {
  notFoundError,
  throwBadRequest,
} = require('../common/utils/handleError.util');
const { findCartById } = require('../repositories/cart.repository');
const {
  findProductsByProductIds,
} = require('../repositories/product.repository');
const {
  getAmountAfterDiscountForProducts,
} = require('../services/discountVoucher.service');

const getProductsAvailableInShop = ({ shopId, products, productsMapById }) => {
  const results = [];
  forEach(products, (product) => {
    const { productId, quantity } = product;
    const foundProduct = get(productsMapById, productId);
    if (foundProduct && foundProduct.shopId === shopId) {
      results.push({
        productId,
        quantity,
        price: foundProduct.price,
      });
    }
  });
  return results;
};

class CheckoutService {
  // applied to logged in or without logged in
  /*
    body: {
      cartId,
      userId,
      orderItems: [
        {
          shopId,
          discounts: [
            {
              discountVoucherId,
              shopId,
              code
            }
          ],
          products: [
            {
              price,
              quantity,
              productId
            }
          ]
        }
      ]
    }
  */
  static async checkoutPreview({ cartId, userId, orderItems }) {
    const foundCart = await findCartById(cartId);
    notFoundError(!foundCart, 'Cart not found');

    const checkoutOrder = {
        totalPrice: 0, // tong tien don hang,
        feeShip: 0, // phi van chuyen
        totalDiscount: 0, // tong tien phi giam gia
        totalCheckout: 0, // tong thanh toan
      },
      newOrderItems = [];

    const productIds = flatMap(orderItems, (orderItem) =>
      flatMap(orderItem?.products || [], 'productId')
    );
    const foundProducts = await findProductsByProductIds(productIds);
    const foundProductsObject = map(foundProducts, (product) =>
      product.toObject()
    );
    const productsMapById = keyBy(foundProductsObject, 'id');

    // const discountCodes = flatMap(orderItems, 'discounts.code');
    // const foundDiscounts = await findDiscountsByCodes(discountCodes);
    // const discountsMapByiId = keyBy(foundDiscounts, 'id');

    // tinh tong tien bill
    for (const orderItem of orderItems) {
      const { shopId, discounts = [], products = [] } = orderItem;
      const verifiedProducts = getProductsAvailableInShop({
        shopId,
        products,
        productsMapById,
      });
      throwBadRequest(
        verifiedProducts.length !== products.length,
        'Order items wrong'
      );

      // tong tien don hang
      const checkoutTotalPrice = reduce(
        verifiedProducts,
        (totalPrice, product) =>
          totalPrice + get(product, 'quantity', 0) * get(product, 'price', 0),
        0
      );
      checkoutOrder.totalPrice = checkoutTotalPrice;

      const newOrderItem = {
        shopId,
        discounts,
        priceRaw: checkoutTotalPrice, // tien truoc khi giam gia
        priceAfterDiscount: checkoutTotalPrice,
        products: verifiedProducts,
      };

      // TODO: ko await trong for, xy ly tuong tu nhu products, ben tren
      if (discounts.length > 0) {
        const { reducedAmount, totalPrice } =
          await getAmountAfterDiscountForProducts({
            code: discounts[0]?.code, // TODO: hien tai dang fix cung chi lay 1 discount
            shopId,
            products,
          });

        // tong tien giam gia
        checkoutOrder.totalDiscount += reducedAmount;

        if (reducedAmount > 0) {
          newOrderItem.priceAfterDiscount = checkoutTotalPrice - reducedAmount;
        }
      }
      // tong tien thanh toan cuoi cung
      checkoutOrder.totalCheckout += newOrderItem.priceAfterDiscount;
      newOrderItems.push(newOrderItem);
    }

    return {
      orderItems,
      newOrderItems,
      checkoutOrder,
    };
  }
}

module.exports = CheckoutService;
