'use strict';

const { get } = require('lodash');
const catchAsync = require('../common/helpers/catchAsync.helper');
const AuthService = require('../services/auth.service');
const { createdResponse } = require('../common/utils/handleSuccess.util');
const pick = require('../common/utils/pick.util');

class AuthController {
  renewToken = catchAsync(async (req, res) => {
    const data = await AuthService.renewToken({
      refreshToken: req.refreshToken,
      user: req.user,
      tokenStore: req.tokenStore,
    });
    createdResponse({
      res,
      message: 'Renew a new pair token',
      metadata: data,
    });
  });

  logout = catchAsync(async (req, res) => {
    const tokenStoreId = get(req, 'tokenStoreId');
    const delToken = await AuthService.logout(tokenStoreId);
    const token = pick(delToken, ['_id', 'userId']);
    Object.assign(token, { deletedCount: 1 });
    createdResponse({
      res,
      message: 'Logout successful',
      metadata: { token },
    });
  });

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
