const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController')

const router = require('express').Router({ mergeParams: true })

// POST /tours/:id/reviews
// GET /tours/:id/reviews
// GET /tours/:id/reviews/:id

router.route('/')
  .get(reviewController.getAllReview)
  .post(authController.protect,
     authController.restrictTo('user'),
     reviewController.createReview)

module.exports = router
