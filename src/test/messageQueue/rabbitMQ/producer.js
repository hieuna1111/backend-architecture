'use strict';

const amqp = require('amqplib');
const message = 'New a product: Title abcde';

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123456@localhost');
    const channel = await connection.createChannel();
    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // send message to consumer channel
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`message sended: ${message}`);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

runProducer()
  .then((res) => console.log(res))
  .catch(console.error);
