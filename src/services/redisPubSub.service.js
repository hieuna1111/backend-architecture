const redis = require('redis');

class RedisPubSubService {
  constructor() {
    this.subscriber = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });
    this.publisher = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        }
        resolve(reply);
      });
    });
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel, (err, channelName) => {
      if (err) console.error('Failed to subscribe: %s', err.message);
      else {
        console.log(
          `Subscribed successfully! This client is currently subscribed to ${channelName} channels.`
        );
      }
    });
    this.subscriber.on('message', (subSubscriberChannel, message) => {
      if (channel === subSubscriberChannel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
