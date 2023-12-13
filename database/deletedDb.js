require('dotenv').config();
const db = require('./index');
const mongoose = require('mongoose');

async function deleted() {
  await db.connect();
  await mongoose.connection.db.dropDatabase();
  await db.disconnect();
  console.log('DB deleted');
};

deleted();
