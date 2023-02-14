const Tour = require('../models/tourModel')

// MiddleWare
exports.checkId = async (req, res, next, val) => {
  next()
}

// GET 
exports.getAllTours = async (req, res) => {
  try {

    // Excluding Fields so that it doesn't popular in find() func
    const queryObj = {...req.query}
    const excludedFields = ['name','page', 'limit', 'sort', 'fields']
    excludedFields.forEach(el => delete queryObj[el]) 
    console.log(queryObj)

    // Advance Filtering 
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); 
    console.log(JSON.parse(queryStr))

    let query = await Tour.find(JSON.parse(queryStr)).sort('-createdAt')

    // Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = await Tour.find(JSON.parse(queryStr)).sort(sortBy)
    }

    // Field limiting
    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = await Tour.find(JSON.parse(queryStr)).select(fields) 
    }

    const tours = await query 
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
