'use strict';

module.exports = function getSelectedData(selected = []) {
  return Object.fromEntries(selected.map((el) => [el, 1]));
};
