'use strict';

const { model, Schema } = require('mongoose'); // Erase if already required
const { API_KEY_PERMISSION } = require('../common/constant/apiKey.constant');

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

const apiKeyPermissionEnum = Object.values(API_KEY_PERMISSION);

// Declare the Schema of the Mongo model
var apiKeySchema = new Schema(
  {
    key: {
      type: String,
      require: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      require: true,
      enum: apiKeyPermissionEnum,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

apiKeySchema.statics.getApiKeyObjectByKey = async function (key) {
  return await this.findOne({ key, status: true }).lean();
};

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
