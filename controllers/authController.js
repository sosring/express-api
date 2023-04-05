const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
/*
const { has } = require('express-mongo-sanitize');
const { compareSync } = require('bcryptjs');
*/

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, res) => {

  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() * process.env.JWT_COOKIE_EXPIRES_IN),
    httpOnly: true
   }

  if(process.env.NODE_ENV === 'production' ) cookieOptions.secure = true
  res.cookie('jwt', token, cookieOptions)

  // Remove the password from the password
  user.password = undefined

  res.status(statusCode)
    .json({
      status: 'success',
      user,
      token
    })
}

exports.signup = catchAsync(async (req, res, next) => {

  const user = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  createAndSendToken(user, 201, res)
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createAndSendToken(user, 200, res)
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email }) 
  if(!user) {
    return next(new AppError('There is not users with email address.', 404))
  }

  // Generate the random reset token 
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })
  
  // Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}` 
  const message =`Forget your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. If you didn't forget your password, please ignore this email!`

  await sendEmail({
    email: req.body.email,
    subject: 'Your password reset token',
    message
  })

  res.status(200)
    .json({
      status: 'success',
      message: 'Token sent to email!' 
    })
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token 
  console.log(req.params)
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')
  console.log(Date.now())
  
  const user = await User.findOne({ 
     passwordResetToken: hashToken
     //passwordResetExpires: { $gt: Date.now() } 
     //Check if passwordResetExpires is greater than current Time
  })

  // If token has not expired, and there is user, set the new password
  if(!user) {
    return next(new AppError('Token is invalid or expired', 400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  // Log the user in, Send JWT token
  createAndSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  // GET user from collection
  const user = await User.findById(req.user.id).select('+password')

  // Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your password is wrong!', 401))
  }
  console.log(req.body)

  // If so, update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()
  // User.findByIdAndUpdate() won't work as intended!

  // Log user in, send JWT
  createAndSendToken(user, 200, res)
})
