const Review = require('../models/reviewModel')
const AppError = require('../utils/appError')  
const catchAsync = require('../utils/catchAsync')

exports.getMyReview = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({user: req.user._id})

  if(!reviews) {
    return next(new AppError("You don't have any reviews!", 400))
  }

  res.status(200)
    .json({
      status: 'success', 
      results: reviews.length,
      data: {
        reviews
      }
    })
})

exports.getTourReview = catchAsync(async (req, res, next) => {
  // Get review by user ref && tour ref
  const reviews = await Review.find({ tour: req.params.id }) 

  // Send error if there is no review 
  if(!reviews) {
    return next(new AppError('There are no review on the tour!', 400))
  }

  res.status(200)
    .json({
      status: 'success', 
      results: reviews.length,
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

exports.updateReview = catchAsync(async (req, res, next) => {
  // Check if the post user is same with the loged in user
  
  res.status(201)
    .json({
      status: 'success',
      review
    })
})
