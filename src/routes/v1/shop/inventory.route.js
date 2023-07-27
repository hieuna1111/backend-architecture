'use strict';

const express = require('express');
const inventoryController = require('../../../controllers/inventory.controller');
const { authentication } = require('../../../common/utils/auth.util');
const router = express.Router();

router.route('/').post(authentication, inventoryController.addStockToInventory);

module.exports = router;
