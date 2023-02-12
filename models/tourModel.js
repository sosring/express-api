const { Schema, model } = require('mongoose')

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name']
  }, 
  duration: Number
})

module.exports = model('tours', tourSchema)
