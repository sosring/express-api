const express = require('express');
const path = require('path')
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Template engine
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// Global Middleware
// Set security HTTP headers
app.use(helmet())

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please try again in an hour!'
})

app.use('/api', limiter)

// serving static files
app.use(express.static(`${__dirname}/public`)); 

// Body parser
app.use(express.json({ limit: '10kb' }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()) // Remove symbols {} $ form req.body 

// Data sanitization against XSS
app.use(xss()) // Converts symbols < ? / into html encode

// Prevent parameter pollution
app.use(hpp({ 
  whitelist: ['duration', 'ratingQuantity', 'ratingsAverage', 'maxGroupSize',  'difficulty', 'price']
}))

// ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'Hello Nigga'
  })
})

app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

// Test middleware
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
