const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

console.log('conected to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDb:', error.message)
  })

const noteSchema = mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (doc, retObject) => {
    retObject.id = retObject._id.toString()
    delete retObject._id
    delete retObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
