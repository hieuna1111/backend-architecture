const {
  createdResponse,
  okResponse,
} = require('../common/utils/handleSuccess.util');
const catchAsync = require('../common/helpers/catchAsync.helper');
const DiscountVoucherService = require('../services/discountVoucher.service');

class DiscountVoucherController {
  createDiscountCode = catchAsync(async (req, res) => {
    const data = await DiscountVoucherService.createDiscountVoucherCode({
      ...req.body,
      shopId: req.shopId,
    });
    createdResponse({
      res,
      message: 'Create discount voucher code successfully!',
      metadata: data,
    });
  });

  getAllDiscountVoucherCodesForShop = catchAsync(async (req, res) => {
    const data = await DiscountVoucherService.getAllDiscountVoucherCodesForShop(
      {
        ...req.query,
        shopId: req.shopId,
      }
    );
    okResponse({
      res,
      message: 'Get all discount voucher for shop successfully',
      metadata: data,
    });
  });
}

module.exports = new DiscountVoucherController();
