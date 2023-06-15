'use strict';

const catchAsync = require('../common/helpers/catchAsync.helper');
const AuthService = require('../services/auth.service');
const { createdResponse } = require('../common/utils/handleSuccess.util');

class AuthController {
  login = catchAsync(async (req, res) => {
    const { user, tokens } = await AuthService.login(req.body);
    createdResponse({
      res,
      message: 'User successfully logged in',
      metadata: { user, tokens },
    });
  });

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
