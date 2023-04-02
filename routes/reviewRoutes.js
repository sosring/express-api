const router = require('express').Router()
const authController = require('../controllers/authController')
const reviewController = require('../controllers/reviewController')

// Reviews of tours
router.route('/:id')
  .get(reviewController.getTourReview)

// Only logedIn user can access these routes 
router.use(authController.protect)
router.post('/create', reviewController.postReview)

// For a user's reviews 
router.route('/')
  .get(reviewController.getMyReview)

module.exports = router
