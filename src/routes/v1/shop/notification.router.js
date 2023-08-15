'use strict';

const express = require('express');
const notificationController = require('../../../controllers/notification.controller');
const { authentication } = require('../../../common/utils/auth.util');
const router = express.Router();

router
  .route('/')
  .get(authentication, notificationController.listNotificationsByUser);

module.exports = router;
