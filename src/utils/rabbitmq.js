const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ: ", error.message);
  }
};

const sendToQueue = async (queue, message) => {
  try {
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ: ", error.message);
  }
};

module.exports = { connectRabbitMQ, sendToQueue };