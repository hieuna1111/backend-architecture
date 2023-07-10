'use strict';

const toObject = require('./plugin/toObject');
const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'inventories';

// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Product',
    },
    shopId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Shop',
    },
    location: {
      type: String,
      default: 'unknown',
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Rating must be greater than or equal to 0'],
    },
    reservations: {
      type: Array,
      default: [],
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

inventorySchema.plugin(toObject);

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);
