const {
  createdResponse,
  okResponse,
} = require('../common/utils/handleSuccess.util');
const catchAsync = require('../common/helpers/catchAsync.helper');
const CheckoutService = require('../services/checkout.service');

class CheckoutController {
  checkoutPreview = catchAsync(async (req, res) => {
    const data = await CheckoutService.checkoutPreview(req.body);
    okResponse({
      res,
      message: 'Get checkout review successfully!',
      metadata: data,
    });
  });
}

module.exports = new CheckoutController();
