const AppError = require('../utils/appError')

const sendErrorDev = (err, res) => {
  res.status(err.statusCode)
    .json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
  // Operational trusted
  if(err.isOperational) {
    res.status(err.statusCode)
      .json({
        status: err.status,
        message: err.message,
      })
  } else {
    res.status(500) 
      .json({
        status: 'error',
        message: 'Something went wrong!',
      })
  }
}

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message, 404)
}

const handleDuplicatFieldDB = err => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)
  const message = `Duplicate field value ${value}. please use another value!`
  return new AppError(message, 404)
}

module.exports = (err, req, res, next) => {
  // console.log(err.stack)

  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  }
  else if ( process.env.NODE_ENV === 'production') {
    let error = {...err}

    if(error.name === 'CastError') error = handleCastErrorDB(error)
    if(error.code === 11000 ) error = handleDuplicatFieldDB(error)

    sendErrorProd(err, res)
  }
}
