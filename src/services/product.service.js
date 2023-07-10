'use strict';

const {
  productModel,
  clothingModel,
  electronicModel,
} = require('../models/product.model');
const { throwBadRequest } = require('../common/utils/handleError.util');
const {
  searchProducts,
  publishProduct,
  unPublishProduct,
  findAllDraftProducts,
  findAllPublishProducts,
  updateProductById,
} = require('../repositories/product.repository');
const { get } = require('lodash');
const { Types } = require('mongoose');
const patchNestedObjectParser = require('../common/utils/nestedObjectParser');
const { insertInventory } = require('../repositories/inventory.repository');

// define factory class to create product
class ProductFactory {
  static productRegistry = {}; //key-class

  static productRegistryType({ type, classRef }) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct({ type, payload }) {
    const productClass = ProductFactory.productRegistry[type];
    throwBadRequest(!productClass, 'Invalid product type: ' + type);
    return new productClass(payload).createProduct();
  }

  static async searchProducts(keySearch) {
    return await searchProducts(keySearch);
  }

  static async publishProduct({ shopId, productId }) {
    return await publishProduct({ shopId, productId });
  }

  static async unPublishProduct({ shopId, productId }) {
    return await unPublishProduct({ shopId, productId });
  }

  static async findAllDraftProducts({ shopId, limit = 50, skip = 0 }) {
    const query = { shopId, isDraft: true };
    return await findAllDraftProducts({ query, limit, skip });
  }

  static async findAllPublishProducts({ shopId, limit = 50, skip = 0 }) {
    const query = { shopId, isPublished: true };
    return await findAllPublishProducts({ query, limit, skip });
  }

  static async updateProduct({ productId, type, payload }) {
    const productClass = ProductFactory.productRegistry[type];
    throwBadRequest(!productClass, 'Invalid product type: ' + type);
    return new productClass(payload).updateProduct(productId);
  }
}

// define base product class
class Product {
  constructor({
    shopId,
    name,
    thumbnail,
    description,
    price,
    quantity,
    type,
    attributes,
  }) {
    this.shopId = shopId;
    this.name = name;
    this.thumbnail = thumbnail;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.attributes = attributes;
  }

  // create a new product
  async createProduct(productId) {
    const newProduct = await productModel.create({ ...this, _id: productId });
    await insertInventory({
      productId: newProduct._id,
      shopId: new Types.ObjectId(this.shopId),
      stock: this.quantity,
    });
    return newProduct;
  }

  async updateProduct({ productId, payload }) {
    return await updateProductById({ productId, payload, model: productModel });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.attributes,
      shopId: this.shopId,
    });
    throwBadRequest(!newClothing, 'Create a new clothing error');

    const newProduct = await super.createProduct(newClothing._id);
    throwBadRequest(!newProduct, 'Create a new product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const payload = this;
    const attributes = get(payload, 'attributes');
    if (attributes) {
      await updateProductById({
        productId,
        payload: attributes,
        model: clothingModel,
      });
    }
    const updatedProduct = await super.updateProduct({
      productId,
      payload: patchNestedObjectParser(payload),
    });
    return updatedProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.attributes,
      shopId: this.shopId,
    });
    throwBadRequest(!newElectronic, 'Create a new electronic error');

    const newProduct = await super.createProduct(newElectronic._id);
    throwBadRequest(!newProduct, 'Create a new product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const payload = this;
    const attributes = get(payload, 'attributes');
    if (attributes) {
      await updateProductById({
        productId,
        payload: attributes,
        model: electronicModel,
      });
    }
    const updatedProduct = await super.updateProduct({
      productId,
      payload: patchNestedObjectParser(payload),
    });
    return updatedProduct;
  }
}

// 1.
/*
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case 'Electronic':
        return new Electronic(payload).createProduct();
      case 'Clothing':
        return new Clothing(payload).createProduct();
      default:
        throwBadRequest(type, 'Invalid type ' + type);
    }
  }
}
*/

ProductFactory.productRegistryType({
  type: 'Clothing',
  classRef: Clothing,
});
ProductFactory.productRegistryType({
  type: 'Electronic',
  classRef: Electronic,
});

module.exports = ProductFactory;
