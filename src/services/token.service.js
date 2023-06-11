'use strict';

const tokenModel = require('../models/token.model');

class TokenService {
  static createToken = async ({ userId, publicKey }) => {
    const publicKeyString = publicKey.toString();
    const token = await tokenModel.create({
      userId,
      publicKey: publicKeyString,
    });
    return token ? token.publicKey : null;
  };
}

module.exports = TokenService;
