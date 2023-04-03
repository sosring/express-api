const Review = require('../models/reviewModel')
const AppError = require('../utils/appError')  
const catchAsync = require('../utils/catchAsync')

exports.getAllReview = catchAsync(async (req, res, next) => {

  let filterObj = {}
  if(req.params.tourId) filterObj = { tour: req.parmas.tourId}
  const reviews = await Review.find(filterObj)

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

exports.createReview = catchAsync(async (req, res, next) => {

  // if !(req.body user && tour) == then set them explicitly 
  if(!req.body.tour) req.body.tour = req.params.tourId
  if(!req.body.user) req.body.user = req.user._id

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
