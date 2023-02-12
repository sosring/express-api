const express = require('express')
const fs = require('fs')

const app = express()
app.use(express.json())
app.use(express.static(`public`))

// Routes
const userRouter = require(`./routes/users`)
const tourRouter = require(`./routes/tours`)

app.use('/users', userRouter)
app.use('/tours', tourRouter)

module.exports = app
