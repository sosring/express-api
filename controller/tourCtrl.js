const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

// MiddleWare
exports.aliasTopTours = (req, res, next) => {
  // Alias
  req.query.limit = 5
  req.query.sort = '-ratingAverage,price'
  req.query.fields = 'name,price,duration,,summary,difficulty'
  next()
}

// GET 
exports.getAllTours = async (req, res) => {
  try {

    // Execute Query
    const features = new APIFeatures(Tour.find(), req.query)
    features
      .filter()
      .sort()
      .limitFields()
      .pagination()

    const tours = await features.query

    res.status(200)
     .json({
       status: 'success',
       results: tours.length,
       data: tours 
     })
  }
  catch (err) {
    res.status(404)
      .json({
        status: 'fail',
        message: err.message
      })
  }
}

exports.getTour = async (req, res) => {
 try {
  const tour = await Tour.findById(req.params.id) 

  res.status(200)
   .json({
     status: 'success',
     data: tour
   })
 }
  catch (err) {
    res.status(404)
      .json({
        status: 'fail',
        message: err.message
      })
  }
}

// POST 
exports.createTour = async (req, res) => {

 try {
  const newTour = await Tour.create(req.body)
  res.status(201)
    .json({
      status: 'success',
      data: newTour
    })
 }
 catch (err) {
   res.status(404) 
     .json({
       status: 'fail',
       message: err.message
     })
 }
}

// PATCH
exports.updateTour = async (req, res) => {

 try {
  const tour  = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })

  res.status(200) 
    .json({
      status: 'success',
      data: tour
    })
 }
 catch (err) {
    res.status(404)
      .json({
        status: 'fail',
        message: err.message
      })
  }
}

// DELETE
exports.deleteOneTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id)

    res.status(204)
      .json({
        status: 'success',
        data: tour 
      })
  }
  catch (err) {
    res.status(404)
      .json({
        status: 'fail',
        message: err.message
      })
  }
}

exports.deleteManyTour =  async (req, res) => {
  try {
    const tour = await Tour.deleteMany(req.body)

    res.status(204)
      .json({
        status: 'success',
        data: tour
      })
  }
  catch (err) {
    res.status(404)
      .json({
        status: 'fail',
        message: err.message
      })
  }
}
