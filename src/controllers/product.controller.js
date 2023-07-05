const productService = require('../services/product.service');
const {
  createdResponse,
  okResponse,
} = require('../common/utils/handleSuccess.util');
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

  /**
   * @description: Searching products for passersby, no need authentication
   * @param {*} keySearch
   * @returns
   */
  searchProducts = catchAsync(async (req, res) => {
    const { keySearch } = req.query;
    const data = await productService.searchProducts(keySearch);
    okResponse({
      res,
      message: 'Get list searching products successfully',
      metadata: data,
    });
  });

  publishProduct = catchAsync(async (req, res) => {
    const data = await productService.publishProduct({
      ...req.body,
      shopId: req.shopId,
    });
    okResponse({
      res,
      message: 'Publish a product successfully',
      metadata: data,
    });
  });

  unPublishProduct = catchAsync(async (req, res) => {
    const data = await productService.unPublishProduct({
      ...req.body,
      shopId: req.shopId,
    });
    okResponse({
      res,
      message: 'Unpublish a product successfully',
      metadata: data,
    });
  });

  getAllDraftProduct = catchAsync(async (req, res) => {
    const data = await productService.findAllDraftProducts({
      shopId: req.shopId,
    });
    okResponse({
      res,
      message: 'Get list draft products successfully',
      metadata: data,
    });
  });

  getAllPublishProduct = catchAsync(async (req, res) => {
    const data = await productService.findAllPublishProducts({
      shopId: req.shopId,
    });
    okResponse({
      res,
      message: 'Get list publish products successfully',
      metadata: data,
    });
  });
}

module.exports = new ProductController();
