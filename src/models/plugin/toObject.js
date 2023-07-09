'use strict';

const { Types } = require('mongoose');

// Define the plugin function
const toObject = (schema) => {
  // Add the toObject transform option
  schema.set('toObject', { transform: convertIds });

  // Helper function to convert ObjectId to id
  function convertIds(doc, ret) {
    if (ret._id) {
      ret.id = ret._id.toString();
    }

    // Convert id fields
    Object.keys(ret).forEach((key) => {
      if (Array.isArray(ret[key])) {
        ret[key].forEach((item) => {
          if (item && item._id) {
            item.id = item._id.toString();
          }
        });
      }
      if (ret[key] instanceof Types.ObjectId) {
        ret[key] = ret[key].toString();
      }
    });
  }
};

module.exports = toObject;
