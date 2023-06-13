const ErrorResponse = require('../handler/error.handler');
const { StatusCodes } = require('../constant/httpStatusCode.constant');

const throwBadRequest = (condition, message) => {
  if (condition) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, message);
  }
};

const throwConflictRequest = (condition, message) => {
  if (condition) {
    throw new ErrorResponse(StatusCodes.CONFLICT, message);
  }
};

module.exports = { throwBadRequest, throwConflictRequest };
