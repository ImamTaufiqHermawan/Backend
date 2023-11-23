const mongoose = require('mongoose');

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

async function connect() {
  await mongoose
    .connect(
      `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
    )
    .then(() => {
      console.log('Connected to mongodb');
    })
    .catch((error) => {
      console.log('Error connecting to MongoDB ', error);
    });
}

async function disconnect() {
  await mongoose.disconnect();
}

module.exports = { connect, disconnect };
