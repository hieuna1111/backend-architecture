'use strict';

const { model, Schema } = require('mongoose');
const { default: slugify } = require('slugify');
require('../models/shop.model');

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
    slug: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater than or equal to 1.0'],
      max: [5, 'Rating must be less than or equal to 5.0'],
    },
    variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// Document middleware: run before .save() and .create() methods
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

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
