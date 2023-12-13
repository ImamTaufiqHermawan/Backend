/* eslint-disable operator-linebreak */
const mongoose = require('mongoose');

let DATABASE_URI;
if (process.env.NODE_ENV === 'production') {
  DATABASE_URI = process.env.PROD_DB_URI;
} else if (process.env.NODE_ENV === 'test') {
  DATABASE_URI = process.env.TEST_DB_URI;
} else {
  DATABASE_URI = process.env.DEV_DB_URI;
}
// eslint-disable-next-line require-jsdoc
async function connect() {
  await mongoose
      .connect(`${DATABASE_URI}`, {authSource: 'admin'})
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
