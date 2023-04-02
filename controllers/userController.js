const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}

  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el]
  })

  return newObj
}

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user password data
  if(req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update please use /updateMyPassword', 404))
  }

  // Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email', 'photo')
  console.log(filteredBody)
  
  // Update the user document
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true, // to trigger this.isNew
    runValidators: true
  })
  // findByIdAndUpdate because the data is not sensitive 

  res.status(200)
    .json({
      status: 'success',
      user: updatedUser
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false }) 

  res.status(204)
    .json({
      status: 'success',
      data: null
    })
})
