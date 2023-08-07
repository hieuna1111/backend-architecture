'use strict';

const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient();
const {
  inventoryReservation,
} = require('../repositories/inventory.repository');

const pExpireAsync = promisify(redisClient.expire).bind(redisClient);
const setExAsync = promisify(redisClient.setex).bind(redisClient);

// cach 2: co the su dung queue: kafka | rabbitMQ | redis queue
// cach 1: su dung lock redis - khóa lạc quan
const acquireLock = async ({ productId, quantity, cartId }) => {
  const key = `lock_v2023${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 giay tam thoi lock

  // một người vào thanh toán, nó sẽ cố gắng thử 10 lần
  for (let i = 0; i < retryTimes; i++) {
    // tạo key mới, thang nao nam giu key nay thi moi dc vao thanh toan
    // @result {1 || 0}
    const result = await setExAsync(key, `in_${cartId}`);
    console.log('result: ', result);
    // 1 =>  if no exist and create success
    if (result === 1) {
      // thao tac voi inventory
      const isReserved = await inventoryReservation({
        productId,
        quantity,
        cartId,
      });
      if (isReserved.modifiedCount > 0) {
        await pExpireAsync(key, expireTime);
        return key;
      }
      return null;
    } // 0 => existed key
    else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

// giai phong lock de nguoi khac mua hang
const releaseLock = async (keyLock) => {
  const delKeyAsync = promisify(redisClient.del).bind(redisClient);
  return await delKeyAsync(keyLock);
};

module.exports = { acquireLock, releaseLock };
