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
const userRouter = require(`./routes/users`)
const tourRouter = require(`./routes/tours`)

app.use('/api/users', userRouter)
app.use('/api/tours', tourRouter)

module.exports = app
