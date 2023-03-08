const { Schema, model } = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Please provide your email!'],
    lowercase: true,
    validate: [validator.isEmail,  'Please provide a valid email']
  },
  photo: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // this only works on SAVE!
      validator: function(el) {
        return el === this.password 
      },
      message: 'Password are not the same!'
    }
  }
}) 

UserSchema.pre('save', async function(next){
  if(!this.isModified('password')) return nuxt() 

  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
  next()
})

module.exports = model('Users', UserSchema)
