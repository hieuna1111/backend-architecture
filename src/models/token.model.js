'use strict';

const toObject = require('./plugin/toObject');
const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Token';
const COLLECTION_NAME = 'tokens';

// Declare the Schema of the Mongo model
var tokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    privateKey: {
      type: String,
      require: true,
    },
    publicKey: {
      type: String,
      require: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

tokenSchema.statics.findTokenByUserId = async function (userId) {
  return await this.findOne({ userId: new Types.ObjectId(userId) }).lean();
};

tokenSchema.statics.findTokenUsedByRefreshToken = async function (
  refreshToken
) {
  return await this.findOne({ refreshTokensUsed: refreshToken });
};

tokenSchema.statics.findTokenByRefreshToken = async function (refreshToken) {
  return await this.findOne({ refreshToken });
};

tokenSchema.statics.findTokenByUserIdAndRemove = async function (userId) {
  return await this.findOneAndRemove({ userId: new Types.ObjectId(userId) });
};

tokenSchema.statics.removeTokenById = async function (id) {
  return await this.findByIdAndRemove(id);
};

tokenSchema.plugin(toObject);

//Export the model
module.exports = model(DOCUMENT_NAME, tokenSchema);
