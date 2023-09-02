'use strict';

const amqp = require('amqplib');

const runConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123456@localhost');
    const channel = await connection.createChannel();
    const queueName = 'test-topic';
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // send message to consumer channel
    channel.consume(
      queueName,
      (messages) => {
        console.log(`Received message: ${messages.content.toString()}`);
      },
      {
        // noAck: - true: sẽ không lưu lại các message cũ, false thì ngược lại
        noAck: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

runConsumer()
  .then((res) => console.log(res))
  .catch(console.error);
