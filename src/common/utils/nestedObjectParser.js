'use strict';

const { isObject, forEach } = require('lodash');

/**
 * @description: Khi sử dụng phương thức patch để cập nhật một số trường trong document, sẽ có những
 * model sẽ có kiểu dữ liệu là object, nếu muốn cập nhật mà ko làm mất đi các giá trị khác trong object
 * thì hàm này sẽ xử lý vấn đề đó. 
 * @param {Object} obj 
 * @returns 
 */
const patchNestedObjectParser = (obj = {}) => {
  const result = {};
  forEach(Object.keys(obj), (k) => {
    if (isObject(obj[k])) {
      const nestedObj = patchNestedObjectParser(obj[k]);
      forEach(Object.keys(nestedObj), (e) => {
        result[`${k}.${e}`] = nestedObj[e];
      });
    } else {
      result[k] = obj[k];
    }
  });
  return result;
};

module.exports = patchNestedObjectParser;
