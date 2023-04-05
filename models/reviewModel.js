const mongoose = require('mongoose')
const Tour = require('../models/tourModel')

// review / rating / createdAt / ref to tour / ref to user

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    trim: true,
    maxlength: [300, 'Review should be under 300 letters!'],
    required: [true, "Review can not be empty!"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour.']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user.']
  }
 },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
 }
)

reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'user',
      select: 'name slug photo'
    })

  next()
})

// This function is on the Model
reviewSchema.statics.calAvgRatings = async function(tourId) {

  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: { 
        _id: '$tour',
        numRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ])

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].numRating,
    ratingsAverage: stats[0].avgRating
  })
}
 
reviewSchema.post('save', function() {
  // this is current doc and constructor is the Model
  this.constructor.calAvgRatings(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.review = await this.findOne()
  next()
})

reviewSchema.post(/^findOneAnd/, async function() {
  // this.findOne() doesn't work here, query has already executed
  await this.review.constructor.calAvgRatings(this.review.tour)
})

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review
