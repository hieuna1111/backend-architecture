const {
  createdResponse,
  okResponse,
} = require('../common/utils/handleSuccess.util');
const catchAsync = require('../common/helpers/catchAsync.helper');
const InventoryService = require('../services/inventory.service');

class InventoryController {
  addStockToInventory = catchAsync(async (req, res) => {
    const data = await InventoryService.addStockToInventory({
      ...req.body,
      shopId: req.shopId,
    });
    createdResponse({
      res,
      message: 'Add stock to inventory!',
      metadata: data,
    });
  });
}

module.exports = new InventoryController();
