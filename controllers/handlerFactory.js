const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures')

// Filter Obj function
const filterObj = (obj, ...allowedFields) => {
  const newObj = {}

  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) newObj[el] = obj[el]
  })

  return newObj
}

exports.getAll = Model => catchAsync(async (req, res, next) => {

  // To allow for nested GET reviews on tour
  let filterObj = {}
  if(req.params.tourId) filterObj = { tour: req.params.tourId}

  const features = new APIFeatures(Model.find(filterObj), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  if(!doc) {
    return next(new AppError("You don't have any document!", 400))
  }

  res.status(200)
    .json({
      status: 'success', 
      results: doc.length,
      data: {
        data: doc 
      }
    })
})


exports.getOne = ( Model, populateOption ) => catchAsync(async (req, res, next) => {

  let query = Model.findById(req.params.id)
  if(populateOption) query.populate(populateOption)

  const doc = await query

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc 
    }
  });
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  // Create error if user password data
  if(req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update please use /updateMyPassword', 404))
  }

  // Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'firstname', 'lastname','email', 'photo', 'review')
  console.log(filteredBody)
  

  // Update the user document
  let query 
  query = Model.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true, // to trigger this.isNew
    runValidators: true
  })

  if(req.params.id) { // Id from Review nested routes 
    query = Model.findById(req.params.id,filteredBody, {
      new: true, // to trigger this.isNew
      runValidators: true
    })
  }

  const doc = await query

  if(!doc) {
    return next(new AppError("You don't have any document!", 404))
  }

  res.status(200)
    .json({
      status: 'success',
      data: doc 
    })
})

exports.deactive = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false }) 

  res.status(204)
    .json({
      status: 'success',
      data: null
    })
})

exports.createOne = Model => catchAsync(async (req, res, next) => {
  if(!req.body.tour) req.body.tour = req.params.tourId
  if(!req.body.user) req.body.user = req.user._id

  const doc = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      doc
    }
  });
});
