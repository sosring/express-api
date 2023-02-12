const Tour = require('../models/tourModel')

// MiddleWare
exports.checkId = async (req, res, next, val) => {
  next()
}

// GET 
exports.getAllTours = async (req, res) => {

  const tours = await Tour.find()

  res.status(200)
   .json({
     status: 'success',
     results: tours.length, 
     data: tours
   })
}

exports.getTour = async (req, res) => {
  const tour = await Tour.find({_id: req.params.id}) 

  if(!tour) {
    return res.status(404)
      .json({
        status: 'fail',
        message: "Indvalid Id"
     })
  }

  res.status(200)
   .json({
     status: 'success',
     data: tour
   })
}

// POST 
exports.createTour = async (req, res) => {

  const newTour = await Tour.create(req.body)
  res.status(201)
    .json({
      status: 'success',
      data: newTour
    })
}

// PATCH
exports.updateTour = async (req, res) => {

  console.log(req.body)
  const tour  = await Tour.updateOne(
    {_id: req.params.id}, 
    {$set: req.body}
  )

  res.status(200) 
    .json({
      status: 'success',
      data: tour
    })
}

// DELETE
exports.deleteOneTour = async (req, res) => {

  const tour = await Tour.deleteOne({_id: req.params.id})

  res.status(204)
    .json({
      status: 'success',
      data: tour 
    })
}

exports.deleteManyTour =  async (req, res) => {
  
  const tour = await Tour.deleteMany(req.body)

  res.status(204)
    .json({
      status: 'success',
      data: tour
    })
}
