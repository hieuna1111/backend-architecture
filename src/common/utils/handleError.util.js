const ErrorResponse = require('../handler/error.handler');
const {
  StatusCodes,
  ReasonPhrases,
} = require('../constant/httpStatusCode.constant');

const databaseError = (condition, message = ReasonPhrases.BAD_GATEWAY) => {
  if (condition) {
    throw new ErrorResponse(StatusCodes.BAD_GATEWAY, message);
  }
};

const throwBadRequest = (condition, message = ReasonPhrases.BAD_REQUEST) => {
  if (condition) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, message);
  }
};

const throwConflictRequest = (condition, message = ReasonPhrases.CONFLICT) => {
  if (condition) {
    throw new ErrorResponse(StatusCodes.CONFLICT, message);
  }
};

module.exports = { databaseError, throwBadRequest, throwConflictRequest };
