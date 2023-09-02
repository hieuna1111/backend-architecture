'use strict';

const amqp = require('amqplib');
const message = 'New a product: Title abcde';

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:123456@localhost');
    const channel = await connection.createChannel();

    const notificationExchange = 'notificationEx'; // notificationEx direct
    const notificationQueue = 'notificationQueueProcess'; // assertQueue
    const notificationExchangeDLX = 'notificationExDLX'; // notificationExDLX direct
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // routing key

    // 1. create exchange
    // Exchange có nhiệm vụ nhận tin nhắn từ producer và đẩy sang nhiều queue (mô hình pub/sub)
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true,
    });

    // 2. create queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false, // cho phép các kết nối truy cập vào hàng đợi cùng lúc
      deadLetterExchange: notificationExchangeDLX, // nếu notificationQueue lỗi hoặc hết hạn nó sẽ gửi tới deadLetterExchange với khóa định tuyến là deadLetterRoutingKey
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    // 3. bindQueue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    // 4. send message
    const msg = 'a new product';
    console.log('producer msg: ', msg);
    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000',
    });

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
