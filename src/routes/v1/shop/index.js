'use strict';

const express = require('express');
const router = express.Router();

const shopRoutes = [
  {
    path: '/products',
    route: require('./product.route'),
  },
  {
    path: '/discount-vouchers',
    route: require('./discountVoucher.route'),
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
