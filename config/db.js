const mongoose = require('mongoose');

const db_url = process.env.DB_URL.replace(
  '<password>',
  process.env.DB_PASSWORD
);

const connect = async () => {
  try {
    await mongoose.connect(db_url);
    console.log('Connected to database successfuly!');
  } catch (err) {
    console.log(err);
  }
};

module.exports = { connect };
