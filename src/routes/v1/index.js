'use strict';

const express = require('express');
const router = express.Router();
const {
  checkApiKey,
  checkPermission,
} = require('../../common/utils/auth.util');

router.get('/ping', (req, res) => {
  return res.send(`
        <br />
        <br />
        <center>
            <h1>
                Hello backend architecture api To AWS EC2
            </h1>
        </center>
    `);
});

// check apiKey
router.use(checkApiKey);
// check permission
router.use(checkPermission('1000')); // TODO: handle permission number

const routeV1 = [
  {
    path: '/auth',
    route: require('./auth.route'),
  },
  {
    path: '/shops',
    route: require('./shop'),
  },
  {
    path: '/carts',
    route: require('./cart.route'),
  },
  {
    path: '/checkouts',
    route: require('./checkout.route'),
  },
  {
    path: '/uploads',
    route: require('./upload.route'),
  },
];

routeV1.forEach((shopRoute) => {
  router.use(shopRoute.path, shopRoute.route);
});

module.exports = router;
