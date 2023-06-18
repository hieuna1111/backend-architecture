'use strict';

const tokenModel = require('../models/token.model');

class TokenService {
  // TODO: save token to redis instead of db
  static saveToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const filter = { userId },
      update = {
        userId,
        publicKey,
        refreshToken,
        privateKey,
        refreshTokensUsed: [], // TODO
      },
      options = { upsert: true, new: true };
    const token = await tokenModel.findOneAndUpdate(filter, update, options);

    return token ? token.publicKey : null;
  };
}

module.exports = TokenService;
