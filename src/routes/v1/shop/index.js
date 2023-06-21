'use strict';

const express = require('express');
const { authentication } = require('../../../common/utils/auth.util');
const router = express.Router();

// authentication
router.use(authentication);

const shopRoutes = [
  {
    path: '/products',
    route: require('./product.route'),
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
