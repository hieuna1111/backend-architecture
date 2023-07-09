'use strict';

const { get } = require('lodash');
const appRoot = require('app-root-path');
const protoBuf = require('protobufjs');

let root;
const init = async () => {
  if (!root) {
    try {
      root = await protoBuf.load(`${appRoot}/src/proto/v1/product.proto`);
    } catch (error) {
      console.error('Error loading proto file:', error);
    }
  }
};
init();

const converterPatchProductResponse = async (data) => {
  await init();
  const patchProductResponse = root.lookupType(
    'v1.product.PatchProductResponse'
  );
  const response = data.toObject();
  const type = get(response, 'type');
  if (type === 'Clothing') {
    response.clothingAttribute = response.attributes;
  }
  if (type === 'Electronic') {
    response.electronicAttribute = response.attributes;
  }
  const payload = {
    message: 'Update product successfully',
    metadata: response,
  };
  const err = patchProductResponse.verify(payload);
  if (err) {
    throw Error(`error when converterPatchProductResponse. ${err}`);
  }
  return patchProductResponse.create(payload).toJSON();
};

module.exports = { converterPatchProductResponse };
