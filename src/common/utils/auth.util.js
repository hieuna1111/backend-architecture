'use strict';

const crypto = require('crypto');
const { get, includes } = require('lodash');
const JWT = require('jsonwebtoken');
const headerParam = require('../constants/headerParam.constant');
const apiKeyModel = require('../../models/apiKey.model');
const catchAsync = require('../helpers/catchAsync.helper');
const { authFailureError, notFoundError } = require('./handleError.util');
const tokenModel = require('../../models/token.model');

/**
 *
 * @param {Object} payload - info's user to register access token and refresh token
 * @param {String} publicKeyObject - made by crypto verify access token if access token is stolen in the process
 * @param {KeyObject} privateKey - made by crypto to register access token and refresh token
 * @returns { accessToken, refreshToken }
 */
const createTokenPair = async ({ payload, publicKey, privateKey }) => {
  //accessToken
  const accessToken = await JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2 days',
  });

  // refreshToken
  const refreshToken = await JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '7 days',
  });

  // TODO: ket hop passport-jwt
  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) {
      console.error(`error verify token::`, err);
    }
    console.log(`decode token::`, decode);
  });

  return { accessToken, refreshToken };
};

const checkApiKey = async (req, res, next) => {
  const key = get(req, `headers[${headerParam.API_KEY}]`);
  if (!key) {
    return res.status(403).json({
      message: 'Forbidden Error',
    });
  }
  // check objKey
  const keyObject = await apiKeyModel.getApiKeyObjectByKey(key);
  if (!keyObject) {
    return res.status(403).json({
      message: 'Forbidden Error',
    });
  }
  req.keyObject = keyObject;
  return next();
};

const checkPermission = (permissions) => {
  return (req, res, next) => {
    const permission = get(req, 'keyObject.permissions');
    if (!permissions) {
      return res.status(403).json({
        message: 'Permission Denied',
      });
    }
    console.log('permissions::', permissions);
    const validPermission = includes(permissions, permission);
    if (!validPermission) {
      return res.status(403).json({
        message: 'Permission Denied',
      });
    }
    return next();
  };
};

const generateKeyPairSync = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
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
  return { publicKey, privateKey };
};

/**
 * 1 - check userId missing ?
 * 2 - get access token
 * 3 - verify token
 * 4 - check user in db
 * 5 - check tokenStore with this userId
 * 6 - OK ALL => return next()
 */
const authentication = catchAsync(async (req, res, next) => {
  // 1.
  const userId = get(req, `headers[${headerParam.USER_ID}]`);
  authFailureError(!userId, 'Header is missing userId');

  // 2.
  const tokenStore = await tokenModel.findTokenByUserId(userId);
  notFoundError(!tokenStore, 'Not found tokenStore');

  // 3.
  const accessToken = get(req, `headers[${headerParam.AUTHORIZATION}]`);
  authFailureError(!accessToken, 'Header is missing accessToken');

  try {
    const decodeUser = JWT.verify(accessToken, tokenStore.publicKey);
    authFailureError(
      userId !== get(decodeUser, 'userId'),
      'Decode accessToken failure'
    );
    req.tokenStoreId = get(tokenStore, '_id');
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = ({ token, keySecret }) => {
  const payload = JWT.verify(token, keySecret);
  return payload;
};

module.exports = {
  authentication,
  createTokenPair,
  checkApiKey,
  checkPermission,
  generateKeyPairSync,
  verifyJWT,
};
