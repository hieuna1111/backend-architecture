'use strict';

const httpStatus = require('http-status');

class SuccessResponse {
  constructor({ message, statusCode, reasonStatusCode, metadata = {} }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({
    message,
    metadata,
    statusCode = httpStatus.OK,
    reasonStatusCode = 'Success',
    options = {},
  }) {
    super({ message, metadata, statusCode, reasonStatusCode, options });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    metadata,
    statusCode = httpStatus.CREATED,
    reasonStatusCode = 'Created',
    options = {},
  }) {
    super({ message, metadata, statusCode, reasonStatusCode, options });
  }
}

module.exports = { OK, CREATED };
