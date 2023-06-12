'use strict';

const { OK, CREATED } = require('../handler/success.handler');

const okResponse = ({ message, metadata, res }) => {
  if (message || metadata) {
    throw new OK({ message, metadata }).send(res);
  }
};

const createdResponse = ({ message, metadata, res }) => {
  if (message || metadata) {
    throw new CREATED({ message, metadata }).send(res);
  }
};

module.exports = { okResponse, createdResponse };
