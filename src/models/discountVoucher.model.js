'use strict';

const toObject = require('./plugin/toObject');
const { model, Schema } = require('mongoose'); // Erase if already required
const voucherType = require('../common/constants/voucherType.constant');

const DOCUMENT_NAME = 'DiscountVoucher';
const COLLECTION_NAME = 'discountVouchers';

const voucherEnum = Object.keys(voucherType);

// Declare the Schema of the Mongo model
var discountVoucherSchema = new Schema(
  {
    shopId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: 'Shop',
    },
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: voucherEnum,
      default: voucherType.fixAmount,
    },
    value: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // tong so luong voucher phat hanh
    voucherNumber: {
      type: Number,
      required: true,
    },
    // so luong da su duoc su dung
    voucherNumberUsed: {
      type: Number,
      min: [0, 'voucherNumberUsed must be greater than or equal to 0'],
    },
    // danh sach user da su dung
    usersUsed: [
      {
        userId: {
          type: String,
        },
        times: {
          type: Number,
        },
      },
    ],
    // moi user chi duoc phep su dung so luong voucher nhat dinh
    numberUsedPerUser: {
      type: Number,
      required: true,
    },
    // gia tri don hang toi thieu de su dung voucher
    minimumOrderValue: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    appliesToProductType: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    //neu appliesToProductType = specific thi se add productId to productIds
    productIds: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

discountVoucherSchema.plugin(toObject);

//Export the model
module.exports = model(DOCUMENT_NAME, discountVoucherSchema);
