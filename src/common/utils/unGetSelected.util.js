'use strict';

module.exports = function unGetSelectedData(unSelected = []) {
  return Object.fromEntries(unSelected.map((el) => [el, 0]));
};
