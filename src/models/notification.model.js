'use strict';

const toObject = require('./plugin/toObject');
const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'notifications';

// Declare the Schema of the Mongo model
var notificationSchema = new Schema(
  {
    // productId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Product',
    // },
    /**
     * ORDER-001: order successfully
     * ORDER-002: order failed
     * SHOPS-001: new product by user following
     * PROMOTION-001: new promotion
     */
    type: {
      type: String,
      enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    receivedId: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

notificationSchema.plugin(toObject);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
