'use strict';

const tokenModel = require('../models/token.model');

class TokenService {
  // TODO: save token to redis instead of db
  static createToken = async ({ userId, publicKey, refreshToken }) => {
    const filter = { userId },
      update = {
        publicKey,
        refreshToken,
        refreshTokensUsed: [],
      },
      options = { upsert: true, new: true };
    const token = await tokenModel.findOneAndUpdate(filter, update, options);

    return token ? token.publicKey : null;
  };

  static updateToken = async ({ userId, publicKey, refreshToken }) => {
    const token = await tokenModel.create({
      userId,
      publicKey,
      refreshToken,
      refreshTokensUsed: [],
    });
    return token ? token.publicKey : null;
  };

  static saveToken = async ({ method, userId, publicKey, refreshToken }) => {
    const saveTokenMethod = {
      create: this.createToken,
      update: this.updateToken,
    };
    return saveTokenMethod[method]({
      userId,
      publicKey: publicKey.toString(),
      refreshToken,
    });
  };
}

module.exports = TokenService;
