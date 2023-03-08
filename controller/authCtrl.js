const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  )
}

exports.signup = catchAsync(async (req, res, next) => {
  // To only the needed data
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  const token = signToken(newUser._id) 

  res.status(201)
    .json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    })
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body 

  // Check if email and password exist
  if(!email || !password) {
    next(new AppError('Please provide email and password', 400))
  }
  
  // Check if user exists && password is correct
  const user = await User.findOne({ email: email }).select('+password')

  // correctPassword code will only run if user is true
  if(!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 404))
  }

  // If everthing ok, send token to client
  const token = signToken(user._id) 
  res.status(200)
    .json({
      status: 'success',
      user,
      token
    })
})

exports.protect = catchAsync(async (req, res, next) => {
  // Get token and check if it exist
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  console.log(token)
  
  // Validate token
  if(!token) {
    next(new AppError('You are not login. Please log in to get access', 404))
  }
  
  // Check if user still exist

  // Check if user changed password after the token was issued

  next()
})
