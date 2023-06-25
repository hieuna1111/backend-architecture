const productService = require('../services/product.service');
const { createdResponse } = require('../common/utils/handleSuccess.util');
const catchAsync = require('../common/helpers/catchAsync.helper');

class ProductController {
  createProduct = catchAsync(async (req, res) => {
    const data = await productService.createProduct({
      type: req.body.type,
      payload: {
        ...req.body,
        shopId: req.shopId,
      },
    });
    createdResponse({
      res,
      message: 'Create a new product successfully',
      metadata: data,
    });
  });
}

module.exports = new ProductController();
