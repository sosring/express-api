const fs = require('fs')
const tours = JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`))

// MiddleWare
exports.checkId = (req, res, next, val) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id))

  if(!tour) {
    return res.status(404)
      .json({
        status: 'fail',
        message: "Indvalid Id"
     })
  }
  next()
}

exports.checkBody = (req, res, next) => {
  if(!req.body.name || !req.body.price) {
    return res.status(400)
      .json({
        status: 'fail',
        message: 'Mising name or price'
      })
  }
  res.status(201)
   .json({
    status: 'success'
  })
  next()
}


// GET 
exports.getAllTours = (req, res) => {
  console.log(req.reqestTime)
  res.status(200)
   .json({
     status: 'success',
     results: tours.length, 
     data: tours 
   })
}

exports.getTour = (req, res) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id))

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
exports.createTour = (req, res) => {

  const newTour = {
    id: (tours.length - 1) + 1,
    body: req.body
  }
  tours.push(newTour)

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {

    if(err) {
      console.log(err)
      return
    }

    res.status(201)
      .json({
        status: 'success',
        data: tours
      })
  })
}

// PATCH
exports.patchTour = (req, res) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id))

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
      data: {
        tour: req.body
      } 
    })
}

// DELETE
exports.deleteTour =(req, res) => {

  const tour = tours.find(t => t.id === parseInt(req.params.id))

  if(!tour) {
    return res.status(404)
      .json({
        status: 'fail',
        message: "Indvalid Id"
     })
  }

  res.status(204)
    .json({
      status: 'success',
      data: tour 
    })
}

