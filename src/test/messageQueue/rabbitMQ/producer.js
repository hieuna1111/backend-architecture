'use strict';

const amqp = require('amqplib');
const message = 'hello, rabbitMQ for backend e-commerce';

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
  } catch (error) {
    console.log(error);
  }
};

runProducer().catch(console.error);
