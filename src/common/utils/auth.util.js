'use strict';

const JWT = require('jsonwebtoken');

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

module.exports = {
  createTokenPair,
};
