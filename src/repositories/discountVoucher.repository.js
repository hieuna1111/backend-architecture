'use strict';

const getSelectedUtil = require('../common/utils/getSelected.util');
const unGetSelectedUtil = require('../common/utils/unGetSelected.util');
const discountVoucherModel = require('../models/discountVoucher.model');

const findAllDiscountCodesSelected = async ({
  limit = 50,
  sort = 'ctime',
  page = 1,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await discountVoucherModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectedUtil(select))
    .lean();
};

const findAllDiscountCodesUnselected = async ({
  limit = 50,
  sort = 'ctime',
  page = 1,
  filter,
  unSelected,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await discountVoucherModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectedUtil(unSelected))
    .lean();
};

module.exports = {
  findAllDiscountCodesSelected,
  findAllDiscountCodesUnselected,
};
