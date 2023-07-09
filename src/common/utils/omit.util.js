'use strict';

const { isObject, map, forEach, isNil, isPlainObject } = require('lodash');

/**
 * @description: Loại bỏ tất cả các đối tượng trong object mà có trường nào null hoặc empty
 * @param {Object || Array} input 
 * @returns 
 */
const omitByNullAndEmpty = (input) => {
  if (!isObject(input) || input === null) {
    return input;
  }

  if (Array.isArray(input)) {
    return map(input, (e) => omitByNullAndEmpty(e));
  }

  return forEach(input, (value, key) => {
    if (!value || isNil(value)) {
      delete input[key];
    }
    if (isPlainObject(value)) {
      input[key] = omitByNullAndEmpty(value);
    }
    if (Array.isArray(value)) {
      input[key] = map(value, (e) => omitByNullAndEmpty(e));
    }
  });
};

module.exports = omitByNullAndEmpty;
