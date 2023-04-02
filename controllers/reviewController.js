const Review = require('../models/reviewModel')
const AppError = require('../utils/appError')  
const catchAsync = require('../utils/catchAsync')

exports.getMyReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.findOne({user: req.user._id})

  if(!reviews) {
    return next(new AppError("You don't have any reviews!", 400))
  }

  res.status(200)
    .json({
      status: 'success', 
      data: {
        reviews
      }
    })
})

exports.getTourReview = catchAsync(async (req, res, next) => {
  // Get review by user ref && tour ref
  const reviews = await Review.findOne({tour: req.params.id}) 

  // Send error if there is no review 
  if(!reviews) {
    return next(new AppError('Theres no review!', 400))
  }

  res.status(200)
    .json({
      status: 'success', 
      data: {
        reviews
      }
    })
})

exports.postReview = catchAsync(async (req, res, next) => {
  // All the data will be from frontend user id and tour id
  const review = await Review.create(req.body)

  res.status(201)
    .json({
      status: 'success',
      review
    })
}) 
