const express = require('express')
const router = express.Router()
const { checkId, checkBody, getAllTours, 
        createTour, getTour, updateTour, 
        deleteOneTour, deleteManyTour } = require('../controller/tourCtrl')

//router.param('id', checkId)

router.route('')
   .get(getAllTours)
   .post(createTour)
   .delete(deleteManyTour)

router.route('/:id')
   .get(getTour)
   .patch(updateTour)
   .delete(deleteOneTour)

module.exports = router
