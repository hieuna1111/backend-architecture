'use strict';

const express = require('express');
const router = express.Router();
const {
  checkApiKey,
  checkPermission,
} = require('../../common/utils/auth.util');

// check apiKey
router.use(checkApiKey);
// check permission
router.use(checkPermission('1000'));

// router.use('/auth', require('./auth.route'));

const routeV1 = [
  {
    path: '/auth',
    route: require('./auth.route'),
  },
  {
    path: '/shops',
    route: require('./shop'),
  },
];

routeV1.forEach((shopRoute) => {
  router.use(shopRoute.path, shopRoute.route);
});

// router.use('/v1/api/shops', require('./product.route.'));

module.exports = router;
