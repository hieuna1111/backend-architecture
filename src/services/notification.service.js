'use strict';

const notificationModel = require('../models/notification.model');

const pushNotificationToSystem = async ({
  type = 'SHOP-001',
  receivedId,
  senderId,
  options = {},
}) => {
  let content;
  if ((type = 'SHOP-001')) {
    content = '@@@ vừa mới thêm một sản phẩm: @@@';
  }
  if ((type = 'PROMOTION-001')) {
    content = '@@@ vừa mới thêm một voucher: @@@';
  }

  const newNotification = await notificationModel.create({
    type,
    content,
    senderId,
    receivedId,
    options,
  });

  return newNotification;
};

const listNotificationsByUser = async ({
  userId = 1,
  type = 'ALL',
  isRead = 0,
}) => {
  const match = { receivedId: userId };
  if (type !== 'ALL') {
    match['type'] = type;
  }
  return await notificationModel.aggregate([
    { $match: match },
    {
      $project: {
        type: 1,
        senderId: 1,
        receivedId: 1,
        content: {
          $concat: [
            {
              $substr: ['$options.shopName', 0, -1],
            },
            'vừa thêm một sản phẩm mới: ', // localization
            {
              $substr: ['$options.productName', 0, -1],
            },
          ],
        },
        createdAt: 1,
        options: 1,
      },
    },
  ]);
};

module.exports = { pushNotificationToSystem, listNotificationsByUser };
