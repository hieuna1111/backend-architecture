const redis = require('redis');

class RedisPubSubService {
  constructor() {
    this.subscriber = redis.createClient();
    this.publisher = redis.createClient();
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
    this.subscriber.subscribe(channel, (err, count) => {
      if (err) console.error('Failed to subscribe: %s', err.message);
      else {
        console.log(
          `Subscribed successfully! This client is currently subscribed to ${count} channels.`
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
