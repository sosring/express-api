const express = require('express')
const router = express.Router()
const { checkId, checkBody, getAllTours, createTour, getTour, patchTour, deleteTour } = require('../controller/tourCtrl')

router.param('id', checkId)

router.route('')
   .get(getAllTours)
   .post(checkBody, createTour)

router.route('/:id')
   .get(getTour)
   .patch(patchTour)
   .delete(deleteTour)

module.exports = router
