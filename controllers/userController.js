const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('../controllers/handlerFactory')

exports.deactive = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false }) 

  res.status(204)
    .json({
      status: 'success',
      data: null
    })
})

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id
  next()
}

exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.updateMe = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
