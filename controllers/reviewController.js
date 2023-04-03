const Review = require('../models/reviewModel')
const AppError = require('../utils/appError')  
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlerFactory')

exports.getAllReview = catchAsync(async (req, res, next) => {

  let filterObj = {}
  if(req.params.tourId) filterObj = { tour: req.params.tourId}
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

exports.createReview = factory.createOne(Review)
exports.deleteReview = factory.deleteOne(Review)
exports.updateReview = factory.updateOne(Review)
