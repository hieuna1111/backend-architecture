'use strict';

const express = require('express');
const router = express.Router();
const { checkApiKey, checkPermission } = require('../common/utils/auth.util');

// check apiKey
router.use(checkApiKey);
// check permission
router.use(checkPermission('1000'));

router.use('/v1/api', require('./auth/index'));

module.exports = router;
