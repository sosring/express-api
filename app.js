const express = require('express')
const morgan = require('morgan')
const fs = require('fs')

const app = express()

// Middleware
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`public`))

// Routes
const userRouter = require(`./routes/users`)
const tourRouter = require(`./routes/tours`)

app.use('/users', userRouter)
app.use('/tours', tourRouter)

module.exports = app
