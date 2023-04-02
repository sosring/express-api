const { Schema, model } = require('mongoose')

// review / rating / createdAt / ref to tour / ref to user

const reviewSchema = new Schema({
  review: {
    type: String,
    trim: true,
    required: [true, "Review can't be upload if its empty!"]
  },
  rating: {
    type: Number,
    default: 1,
    required: [true, 'A review must have a rating!']
  },
  createdAt: Date,
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
})

module.exports = model('Review', reviewSchema)
