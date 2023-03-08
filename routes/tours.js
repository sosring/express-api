const express = require('express')
const router = express.Router()
const { getMontlyPlan, getTourStats, aliasTopTours, 
        checkBody, getAllTours, createTour, getTour, 
        updateTour, deleteOneTour, deleteManyTour } = require('../controller/tourCtrl')
const { protect } = require('../controller/authCtrl')

//router.param('id', checkId)
router.route('/top-5-cheap')
   .get(aliasTopTours, getAllTours)

router.route('/tour-stats')
    .get(getTourStats)

router.route('/monthly-plan/:year')
    .get(getMontlyPlan)

router.route('')
   .get(protect, getAllTours)
   .post(createTour)
   .delete(deleteManyTour)

router.route('/:id')
   .get(getTour)
   .patch(updateTour)
   .delete(deleteOneTour)

module.exports = router
