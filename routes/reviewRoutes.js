const router = require('express').Router()
const authController = require('../controllers/authController')
const reviewController = require('../controllers/reviewController')

router.use(authController.protect)

router.post('/create', reviewController.postReview)

// For a user's reviews 
router.route('/')
  .get(reviewController.getMyReview)

router.route('/:id')
  .get(reviewController.getTourReview)

module.exports = router
