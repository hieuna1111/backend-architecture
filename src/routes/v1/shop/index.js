'use strict';

const express = require('express');
const router = express.Router();

const shopRoutes = [
  {
    path: '/products',
    route: require('./product/index'),
  },
  {
    path: '/discount-vouchers',
    route: require('./discountVoucher.route'),
  },
  {
    path: '/inventories',
    route: require('./inventory.route'),
  },
  {
    path: '/notifications',
    route: require('./notification.router'),
  },
];

shopRoutes.forEach((shopRoute) => {
  router.use(
    `/:shopId${shopRoute.path}`,
    (req, res, next) => {
      req.shopId = req.params.shopId;
      next();
    },
    shopRoute.route
  );
});

module.exports = router;
