'use strict';

const {
  StatusCodes,
  ReasonPhrases,
} = require('../constant/httpStatusCode.constant');

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
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    options = {},
  }) {
    super({ message, metadata, statusCode, reasonStatusCode, options });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    metadata,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    options = {},
  }) {
    super({ message, metadata, statusCode, reasonStatusCode, options });
  }
}

module.exports = { OK, CREATED };
