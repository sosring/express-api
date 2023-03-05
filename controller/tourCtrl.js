const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

// MiddleWare
exports.aliasTopTours = (req, res, next) => {
  // Alias
  req.query.limit = 5
  req.query.sort = '-ratingAverage,price'
  req.query.fields = 'name,price,duration,,summary,difficulty'
  next()
}

// GET 
exports.getAllTours = catchAsync(async (req, res, next) => {
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
})

exports.getTour = catchAsync(async (req, res, next) => {

  const tour = await Tour.findById(req.params.id) 

  if(!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200)
   .json({
     status: 'success',
     data: tour
   })
})

// POST 
exports.createTour = catchAsync(async (req, res, next) => {

  const newTour = await Tour.create(req.body)
  res.status(201)
    .json({
      status: 'success',
      data: newTour
    })
})

// PATCH
exports.updateTour = catchAsync(async (req, res, next) => {

  const tour  = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })

  res.status(200) 
    .json({
      status: 'success',
      data: tour
    })
})

// DELETE
exports.deleteOneTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findByIdAndDelete(req.params.id)

    res.status(204)
      .json({
        status: 'success',
        data: tour 
      })
})

exports.deleteManyTour =  catchAsync(async (req, res, next) => {

    const tour = await Tour.deleteMany(req.body)

    res.status(204)
      .json({
        status: 'success',
        data: tour
      })
})

exports.getTourStats = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
      {
        $match: { ratingAverage: { $gte: 4.5 }}
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          results: { $sum: 1 },
          avgRating: { $avg: "$ratingAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $sort: { avgPrice: 1 }
      },
      /*
      {
        $match: { _id: { $ne: 'EASY' } }
      }*/
    ])  

    res.status(200)
      .json({
        status: 'success',
        data: stats 
    })
})

exports.getMontlyPlan = catchAsync(async (req, res, next) => {
    const year = parseInt(req.params.year)

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates' 
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: {$push: '$name'}
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0 
        }
      },
      {
        $sort: { numTourStarts: -1 }
      }
    ])

    res.status(200)
      .json({
        status: 'success',
        results: plan.length,
        data: plan 
    })
})
