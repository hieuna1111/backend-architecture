'use strict';

const productService = require('../services/product.service');
const {
  createdResponse,
  okResponse,
} = require('../common/utils/handleSuccess.util');
const catchAsync = require('../common/helpers/catchAsync.helper');
const omitByNullAndEmpty = require('../common/utils/omit.util');
const {
  converterPatchProductResponse,
} = require('../converter/v1/product.converter');

class ProductController {
  createProduct = catchAsync(async (req, res) => {
    const payload = omitByNullAndEmpty({ ...req.body, shopId: req.shopId });
    const data = await productService.createProduct({
      type: req.body.type,
      payload,
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

  updateProduct = catchAsync(async (req, res) => {
    const payload = omitByNullAndEmpty({ ...req.body, shopId: req.shopId });
    const data = await productService.updateProduct({
      productId: req.params.productId,
      type: req.body.type,
      payload,
    });
    const response = await converterPatchProductResponse(data);
    okResponse({
      ...response,
      res,
    });
  });
}

module.exports = new ProductController();
