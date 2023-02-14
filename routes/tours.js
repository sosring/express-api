const express = require('express')
const router = express.Router()
const { getTourStats, aliasTopTours, checkBody,
        getAllTours, createTour, getTour, updateTour, 
        deleteOneTour, deleteManyTour } = require('../controller/tourCtrl')

//router.param('id', checkId)

router.route('/top-5-cheap')
   .get(aliasTopTours, getAllTours)

router.route('/tour-stats')
    .get(getTourStats)

router.route('')
   .get(getAllTours)
   .post(createTour)
   .delete(deleteManyTour)

router.route('/:id')
   .get(getTour)
   .patch(updateTour)
   .delete(deleteOneTour)

module.exports = router
