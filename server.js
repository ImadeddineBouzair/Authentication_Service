require('dotenv').config();
require('./config/db').connect();
const app = require('./app');

const port = process.env.PORT || 5500;
const server = app.listen(port, () =>
  console.log(`The server is running on: http://127.0.0.1:8000`)
);

// Catching uncaughtException
process.on('uncaughtException', (err) => {
  console.log('UncaughtExcrption!');
  console.log(err);

  // Closing the server
  server.close(() => process.exit(1));
});

// Catching unhandled rejection promises
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection!');
  console.log(err);

  // Closing the server
  server.close(() => process.exit(1));
});
