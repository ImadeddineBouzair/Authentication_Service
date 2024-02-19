const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const customErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Seting security HTTP header
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limit
app.use(
  '/api',
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // Onw houre then we can request again
    message: 'To many requests from this IP, Pleas try again later!',
  })
);

app.use(express.json({ limit: '10kb' }));

// Data sanizitation
app.use(mongoSanitize());
// Data sanizitation against xss (Cross site scripting);
app.use(xss());

// Preventing parameter pollution
app.use(hpp({}));

app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(customErrorHandler);

module.exports = app;
