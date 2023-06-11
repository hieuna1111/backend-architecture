const httpStatus = require('http-status');
const ErrorResponse = require('../handler/error.handler');

const throwBadRequest = (condition, message) => {
  if (condition) {
    throw new ErrorResponse(httpStatus.BAD_REQUEST, message);
  }
};

const throwConflictRequest = (condition, message) => {
  if (condition) {
    throw new ErrorResponse(httpStatus.CONFLICT, message);
  }
};

module.exports = { throwBadRequest, throwConflictRequest };
