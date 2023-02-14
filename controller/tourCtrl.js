const Tour = require('../models/tourModel')

// MiddleWare
exports.checkId = async (req, res, next, val) => {
  next()
}

// GET 
exports.getAllTours = async (req, res) => {
  try {
    // Excluding fields
    const queryObj = {...req.query}
    const excludedFields = ['name', 'page', 'fields', 'limit', 'sort']
    excludedFields.forEach(el => delete queryObj[el])

    // Advance filtering
    let queryStr =  JSON.stringify(queryObj) 
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    let query = Tour.find(JSON.parse(queryStr))

    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ') // to add mutiple sort query
      query = query.sort(sortBy)
    }
    else {
      query = query.sort('-createAt')
    }

    // Limiting fields
    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    }

    // Pagination
    const page = req.query.page || 1 
    const limit = req.query.limit || 0
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

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
