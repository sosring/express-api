const Review = require('../models/reviewModel')
const factory = require('../controllers/handlerFactory')

exports.getAllReview = factory.getAll(Review)
exports.getReview = factory.getOne(Review)
exports.createReview = factory.createOne(Review)
exports.deleteReview = factory.deleteOne(Review)
exports.updateReview = factory.updateOne(Review)
