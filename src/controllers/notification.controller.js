'use strict';

const catchAsync = require('../common/helpers/catchAsync.helper');
const {
  createdResponse,
  okResponse,
} = require('../common/utils/handleSuccess.util');
const NotificationService = require('../services/notification.service');

class NotificationController {
  listNotificationsByUser = catchAsync(async (req, res) => {
    const data = await NotificationService.listNotificationsByUser(req.body);
    createdResponse({
      res,
      message: 'Get list notifications by user!',
      metadata: data,
    });
  });
}

module.exports = new NotificationController();
