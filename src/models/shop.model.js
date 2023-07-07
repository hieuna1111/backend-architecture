'use strict';

const toObject = require('./plugin/toObject');
const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'shops';

// Declare the Schema of the Mongo model
var shopSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

shopSchema.plugin(toObject);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
