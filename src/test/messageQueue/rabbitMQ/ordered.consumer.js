'use strict';
const amqp = require('amqplib');

async function consumerOrderedMessage() {
  const connection = await amqp.connect('amqp://guest:123456@localhost');
  const channel = await connection.createChannel();
  const queueName = 'ordered-queued-message';
  await channel.assertQueue(queueName, {
    durable: true,
  });

  // muốn sắp xếp theo thứ tự, đảm bảo mỗi tác vụ chỉ đảm bảo thực hiện 1 công việc, công việc này xong mới đến công việc khác
  // => set prefetch
  // nhược điểm, thời gian thực hiện hết queue sẽ lâu hơn
  channel.prefetch(1);

  channel.consume(queueName, (msg) => {
    const message = msg.content.toString();

    setTimeout(() => {
      console.log(`processed: ${message}`);
      channel.ack(msg);
    }, Math.random() * 1000);
  });
}

consumerOrderedMessage().catch((err) => console.error(err));
