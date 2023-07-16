'use strict';

const { Types } = require('mongoose');

module.exports = function objectId(idString) {
  return new Types.ObjectId(idString);
};
