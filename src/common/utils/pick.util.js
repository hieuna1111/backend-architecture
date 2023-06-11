'use strict';

const { isEmpty, isObject, isArray, some, isString } = require('lodash');

const pick = (object = {}, keys = []) => {
  if (!isObject(object)) return new Error(`${object} not an Object`);
  if (!isArray(keys)) return new Error(`${keys} not an Array`);
  if (!some(keys, (key) => isString(key)))
    return new Error(`Exists values in ${keys} are not String`);

  return keys.reduce((newObject, key) => {
    const value = object[key];
    if (!isEmpty(value) || isObject(value)) {
      newObject[key] = value;
    }
    return newObject;
  }, {});
};

module.exports = pick;
