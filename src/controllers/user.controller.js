'use strict';

const catchAsync = require('../common/handler/catchAsync.handler');
const AuthService = require('../services/auth.service');
const { createdResponse } = require('../common/utils/handleSuccess.util');

class AuthController {
  signUp = catchAsync(async (req, res) => {
    const { user, accessToken, refreshToken } = await AuthService.signUp(
      req.body
    );
    createdResponse({
      res,
      message: 'User account registration successful',
      metadata: { user, tokens: { accessToken, refreshToken } },
    });
  });
}

module.exports = new AuthController();
