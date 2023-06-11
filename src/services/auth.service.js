'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createTokenPair } = require('../common/utils/auth.util');
const pick = require('../common/utils/pick.util');
const TokenService = require('./token.service');
const userModel = require('../models/user.model');
const { USER_ROLE } = require('../common/constant/auth.constant');
const { throwBadRequest } = require('../common/utils/handleError.util');

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

    if (newUser) {
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
      console.log({ privateKey, publicKey });

      const publicKeyString = await TokenService.createToken({
        userId: newUser._id,
        publicKey,
      });
      throwBadRequest(!publicKeyString, 'publicKeyString error!');

      const publicKeyObject = crypto.createPublicKey(publicKeyString);

      // created token pair
      const tokens = await createTokenPair({
        payload: { userId: newUser._id, email },
        publicKeyObject,
        privateKey,
      });
      console.log(`Created Token Success::`, tokens);

      return {
        code: 201,
        metadata: {
          user: pick(newUser, ['_id', 'name', 'email']),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AuthService;
