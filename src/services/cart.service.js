'use strict';

const { get, find } = require('lodash');
const objectId = require('../common/utils/objectId.util');
const CartModel = require('../models/cart.model');
const { productModel } = require('../models/product.model');
const cartStatus = require('../common/constants/cartStatus.constant');
const {
  notFoundError,
  throwBadRequest,
} = require('../common/utils/handleError.util');

/**
 * Key features for Cart service:
 * - add product to cart [USer]
 * - reduce product quantity [User]
 * - increment product quantity [User]
 * - get cart [User]
 * - delete cart [User]
 * - delete cart item [User]
 */

class CartService {
  static async _addNewProductToCart({ userId, product }) {
    const query = { userId, status: cartStatus.activated },
      updateOrInsert = {
        $addToSet: {
          products: product,
        },
        $inc: {
          countProduct: 1,
        },
      },
      options = { upsert: true, new: true };
    return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        userId,
        'products.productId': productId,
        status: cartStatus.activated,
      },
      updateSet = {
        $inc: {
          'products.$.quantity': quantity,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return await CartModel.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    const userCart = await CartModel.findOne({
      userId,
      status: cartStatus.activated,
    });

    // neu chua co gio hang
    if (!userCart) return await this._addNewProductToCart({ userId, product });

    // neu co gio hang nhung chua co san pham nao trong gio hang
    if (userCart && !get(userCart, 'products', []).length) {
      userCart.products = [product];
      userCart.countProduct = 1;
      return await userCart.save();
    }

    const productsInCart = get(userCart, 'products', []);
    const productExistedInCart = find(
      productsInCart,
      (item) => get(item, 'productId') === get(product, 'productId')
    );
    // gio hang ton tai va co san pham nay thi cap nhat so luong
    if (productExistedInCart) {
      return await this.updateUserCartQuantity({ userId, product });
    }

    // gio hang ton tai va va muon them san pham moi
    return this._addNewProductToCart({ userId, product });
  }

  // update cart
  /*
    body: {
      orderItems: [
        {
          shopId,
          products: [
            {
              quantity,
              price,
              oldQuantity,
              productId,
            }
          ],
        }
      ],
      version
    }
  */
  static async updateCart({ userId, product = {}, orderItems = [] }) {
    const { shopId, products } = get(orderItems, '0');
    const { productId, oldQuantity, quantity } = get(products, '0');
    const foundProduct = await productModel.findOne({
      _id: objectId(productId),
      shopId: objectId(shopId),
      isPublished: true,
    });
    notFoundError(!foundProduct, 'Product does not exist in the shop');

    if (quantity === 0) {
      // delete
    }

    return await this.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  }

  static async deleteProductInCart({ userId, productId }) {
    const query = { userId, status: cartStatus.activated },
      updateSet = { $pull: { products: { productId } } };
    return await CartModel.updateOne(query, updateSet);
  }

  static async listProductsInCart({ userId }) {
    return await CartModel.findOne({ userId: objectId(userId) }).lean();
  }
}

module.exports = CartService;
