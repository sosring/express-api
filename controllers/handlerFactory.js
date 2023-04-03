const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

  // If user submits password send Error
  if(req.body.password || req.body.passwordConfirm) {
    return next(new AppError('You can not update your password in this route!', 400))
  }

  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!doc) {
    return next(new AppError('No Document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
});

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
