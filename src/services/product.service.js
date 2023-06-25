'use strict';

const {
  productModel,
  clothingModel,
  electronicModel,
} = require('../models/product.model');
const { throwBadRequest } = require('../common/utils/handleError.util');

// define factory class to create product
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case 'Electronic':
        return new Electronic(payload).createElectronic();
      case 'Clothing':
        return new Clothing(payload).createClothing();
      default:
        throwBadRequest(type, 'Invalid type ' + type);
    }
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
  async createClothing() {
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
  async createElectronic() {
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

module.exports = ProductFactory;
