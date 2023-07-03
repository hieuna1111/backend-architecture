'use strict';

const {
  productModel,
  clothingModel,
  electronicModel,
} = require('../models/product.model');
const { throwBadRequest } = require('../common/utils/handleError.util');
const {
  findAllDraftProductsForShop,
} = require('../repositories/product.repository');

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

  static async findAllDraftProductsForShop({ shopId, limit = 50, skip = 0 }) {
    const query = { shopId, isDraft: true };
    return await findAllDraftProductsForShop({ query, limit, skip });
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
    return await productModel.create({ ...this, _id: productId });
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
