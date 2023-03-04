const express = require('express')
const morgan = require('morgan')

const app = express()

// Middleware
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`public`))

// Routes
const AppError = require(`./utils/appError`)
const userRouter = require(`./routes/users`)
const tourRouter = require(`./routes/tours`)

app.use('/api/tours', tourRouter)
app.use('/api/users', userRouter)

// Catching all error
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

const globalErrorHandler = require('./controller/errorController')
app.use(globalErrorHandler)

module.exports = app
