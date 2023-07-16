'use strict';

const toObject = require('./plugin/toObject');
const { model, Schema } = require('mongoose'); // Erase if already required
const cartStatus = require('../common/constants/cartStatus.constant');

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts';

const cartStatusEnum = Object.keys(cartStatus);

// Declare the Schema of the Mongo model
var cartSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      enum: cartStatusEnum,
      default: cartStatus.activated,
    },
    /*
      [
        {
          productId,
          shopId,
          name,
          price
        }
      ]
    */
    products: {
      type: Array,
      required: true,
      default: [],
    },
    countProduct: {
      type: Number,
      required: true,
      min: [0, 'countProduct must be greater than or equal to 0'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

cartSchema.plugin(toObject);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);
