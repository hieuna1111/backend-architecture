'use strict';

const tokenModel = require('../models/token.model');

class TokenService {
  // TODO: save token to redis instead of db
  static saveToken = async ({ userId, publicKey }) => {
    const publicKeyString = publicKey.toString();
    const token = await tokenModel.create({
      userId,
      publicKey: publicKeyString,
    });
    return token ? token.publicKey : null;
  };
}

module.exports = TokenService;
