'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createTokenPair } = require('../common/utils/auth.util');
const pick = require('../common/utils/pick.util');
const TokenService = require('./token.service');
const userModel = require('../models/user.model');
const { USER_ROLE } = require('../common/constant/auth.constant');
const {
  throwBadRequest,
  databaseError,
} = require('../common/utils/handleError.util');

class AuthService {
  static signUp = async ({ name, email, password }) => {
    // step 1: check email exists?
    const user = await userModel.findOne({ email }).lean();
    throwBadRequest(user, 'Users already registered!');

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      roles: [USER_ROLE.RESTAURANT_OWNER],
    });
    databaseError(!newUser, 'New user not registered yet!');

    // created privateKey, publicKey
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1', // Public Key CryptoGraphic KeyStore
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1', // Public Key CryptoGraphic KeyStore
        format: 'pem',
      },
    });

    // created token pair
    const { accessToken, refreshToken } = await createTokenPair({
      payload: { userId: newUser._id, email },
      publicKey,
      privateKey,
    });

    const publicKeyString = await TokenService.saveToken({
      userId: newUser._id,
      publicKey,
      refreshToken,
    });
    throwBadRequest(!publicKeyString, 'Error, save token!');

    return {
      user: pick(newUser, ['_id', 'name', 'email']),
      accessToken,
      refreshToken,
    };
  };
}

module.exports = AuthService;
