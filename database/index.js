const mongoose = require('mongoose');

const DATABASE_URI = process.env.DATABASE_URI;

// eslint-disable-next-line require-jsdoc
async function connect() {
  await mongoose
      .connect(`${DATABASE_URI}`)
      .then(() => {
        console.log('Connected to mongodb');
      })
      .catch((error) => {
        console.log('Error connecting to MongoDB ', error);
      });
}

// eslint-disable-next-line require-jsdoc
async function disconnect() {
  await mongoose.disconnect();
}

module.exports = {connect, disconnect};
