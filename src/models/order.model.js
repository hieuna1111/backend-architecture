'use strict';

const toObject = require('./plugin/toObject');
const { model, Schema } = require('mongoose'); // Erase if already required
const orderStatus = require('../common/constants/orderStatus.constant');

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'orders';

const orderStatusEnum = Object.keys(orderStatus);

// Declare the Schema of the Mongo model
var orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    /*
      checkout: {
        totalPrice,
        totalApplyDiscount,
        feeShip,
      }
    */
    checkout:{
      type: Object,
      default: {},
    },
    /*
      shipInfo: {
        street,
        city,
        state,
        country,
      }
    */
    shipInfo: {
      type: Object,
      default: {},
    },
    payment: {
      type: Object,
      default: {},
    },
    products: {
      type: Array,
      default: [],
    },
    trackingNumber: {
      type: String,
      default: '#00011082023'
    },
    status: {
      type: String,
      required: true,
      enum: orderStatusEnum,
      default: orderStatus.pending,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

orderSchema.plugin(toObject);

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
