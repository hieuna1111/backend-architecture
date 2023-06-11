'use strict';

const catchAsync = require('../common/handler/catchAsync.handler');
const AuthService = require('../services/auth.service');

class AuthController {
  signUp = catchAsync(async (req, res) => {
    console.log(`[P]::sign-up:`, req.body);
    return res.status(201).json(await AuthService.signUp(req.body));
  });
}

module.exports = new AuthController();
