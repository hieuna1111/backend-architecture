'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'products';

const productSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Electronic', 'Clothing', 'Furniture'],
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const clothingSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    collection: 'clothes',
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    manufacturer: {
      type: String,
      required: true,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  {
    collection: 'electronics',
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    collection: 'furniture',
    timestamps: true,
  }
);

module.exports = {
  productModel: model(DOCUMENT_NAME, productSchema),
  clothingModel: model('Clothing', clothingSchema),
  electronicModel: model('Electronic', electronicSchema),
  furnitureModel: model('Furniture', furnitureSchema),
};
