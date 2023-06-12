'use strict';

const catchAsync = require('../common/handler/catchAsync.handler');
const AuthService = require('../services/auth.service');
const { createdResponse } = require('../common/utils/handleSuccess.util');

class AuthController {
  signUp = catchAsync(async (req, res) => {
    const { user, accessToken, refreshToken } = await AuthService.signUp(
      req.body
    );
    res.setHeader('Authorization', accessToken);
    // TODO: refreshToken save to redis
    createdResponse({
      res,
      message: 'User account registration successful',
      metadata: { user },
    });
  });
}

module.exports = new AuthController();
