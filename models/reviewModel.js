const mongoose = require('mongoose')

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

reviewSchema.pre(/^find/, function(next) {
  this.populate({
      path: 'user',
      select: '-__v -passwordChangedAt'
    })

  next()
})

module.exports = mongoose.model('Review', reviewSchema)
