'use strict';

const { get, includes } = require('lodash');
const JWT = require('jsonwebtoken');
const { API_KEY_HEADER } = require('../constant/apiKey.constant');
const apiKeyModel = require('../../models/apiKey.model');

/**
 *
 * @param {Object} payload - info's user to register access token and refresh token
 * @param {String} publicKeyObject - made by crypto verify access token if access token is stolen in the process
 * @param {KeyObject} privateKey - made by crypto to register access token and refresh token
 * @returns { accessToken, refreshToken }
 */
const createTokenPair = async ({ payload, publicKeyObject, privateKey }) => {
  try {
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

    JWT.verify(accessToken, publicKeyObject, (err, decode) => {
      if (err) {
        console.error(`error verify token::`, err);
      }
      console.log(`decode token::`, decode);
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const checkApiKey = async (req, res, next) => {
  try {
    const key = get(req, `headers[${API_KEY_HEADER.API_KEY}]`, '').toString();
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
  } catch (error) {
    next(error);
  }
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

module.exports = {
  createTokenPair,
  checkApiKey,
  checkPermission,
};
