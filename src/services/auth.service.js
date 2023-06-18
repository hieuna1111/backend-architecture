'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {
  createTokenPair,
  generateKeyPairSync,
  verifyJWT,
} = require('../common/utils/auth.util');
const ErrorResponse = require('../common/handlers/error.handler');
const pick = require('../common/utils/pick.util');
const TokenService = require('./token.service');
const userModel = require('../models/user.model');
const userRole = require('../common/constants/role.constant');
const {
  throwBadRequest,
  databaseError,
  notFoundError,
  authFailureError,
} = require('../common/utils/handleError.util');
const tokenModel = require('../models/token.model');
const StatusCodes = require('../common/constants/statusCodes.constant');

class AuthService {
  /**
   * check token used?
   */
  static handleRefreshToken = async (refreshToken) => {
    // check xem token da duoc su dung chua
    const foundToken = await tokenModel.findTokenUsedByRefreshToken(
      refreshToken
    );

    // neu co
    if (foundToken) {
      // decode
      const { userId } = verifyJWT({
        token: refreshToken,
        keySecret: foundToken.privateKey,
      });
      // xoa token trong keyStore
      await tokenModel.findTokenByUserIdAndRemove(userId);
      throw new ErrorResponse(
        StatusCodes.FORBIDDEN,
        'Something wrong happen, please re-login'
      );
    }

    // NO, wonderful
    const holderToken = await tokenModel.findTokenByRefreshToken(refreshToken);
    authFailureError(!holderToken, 'Refresh token invalid');

    // verify token
    const { userId, email } = verifyJWT({
      token: refreshToken,
      keySecret: holderToken.privateKey,
    });
    // check userId
    const foundUser = await userModel.findUserByEmail(email);
    authFailureError(!foundUser, 'User is not registered');

    // create a new key pair
    const tokens = await createTokenPair({
      payload: { userId, email },
      publicKey: holderToken.publicKey,
      privateKey: holderToken.privateKey,
    });

    // update token
    await tokenModel.updateOne(
      {
        _id: holderToken._id,
      },
      {
        $set: { refreshToken: tokens.refreshToken },
        $addToSet: { refreshTokensUsed: refreshToken },
      }
    );

    return {
      user: { userId, email },
      tokens,
    };
  };

  static logout = async (tokenStoreId) => {
    const delToken = await tokenModel.removeTokenById(tokenStoreId);
    notFoundError(!delToken, 'Token is not exist');
    return delToken;
  };

  /**
   * 1 - check email in db
   * 2 - match password
   * 3 - create public key and private key
   * 4 - generate access token and refresh token
   * 5 - get data return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1.
    const foundUser = await userModel.findUserByEmail(email);
    throwBadRequest(!foundUser, 'Email is not registered!');
    const { _id: userId } = foundUser;

    // 2.
    const match = bcrypt.compare(password, foundUser.password);
    throwBadRequest(!match, 'Authentication error');

    // 3.
    const { publicKey, privateKey } = generateKeyPairSync();

    // 4.
    const tokens = await createTokenPair({
      payload: { userId, email },
      publicKey,
      privateKey,
    });

    const publicKeyString = await TokenService.saveToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    throwBadRequest(!publicKeyString, 'Error, save token!');

    return {
      user: pick(foundUser, ['_id', 'name', 'email']),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step 1: check email exists?
    const user = await userModel.findOne({ email }).lean();
    throwBadRequest(user, 'Users already registered!');

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      roles: [userRole.RESTAURANT_OWNER],
    });
    databaseError(!newUser, 'New user not registered yet!');
    const { _id: userId } = newUser;

    // created privateKey, publicKey
    const { publicKey, privateKey } = generateKeyPairSync();

    // created token pair
    const { accessToken, refreshToken } = await createTokenPair({
      payload: { userId, email },
      publicKey,
      privateKey,
    });

    const publicKeyString = await TokenService.saveToken({
      userId,
      publicKey,
      privateKey,
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
