'use strict';

const toObject = require('./plugin/toObject');
const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'comments';

// Declare the Schema of the Mongo model
var commentSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      default: 'text',
    },
    commentLeft: {
      type: Number,
      default: 0,
    },
    commentRight: {
      type: Number,
      default: 0,
    },
    parentCommentId
    : {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

commentSchema.plugin(toObject);

//Export the model
module.exports = model(DOCUMENT_NAME, commentSchema);
