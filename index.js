require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())

// Middleware cors

app.use(cors())

// Middlewere
// cunado veas el next sabes que es un Middleware

function requestLogger (request, response, next) {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('----')
  next()
}

// usando Middleware en la app
app.use(requestLogger)

// home

app.get('/', (request, response) => {
  response.send('<h1>Welcome To My API</h1>')
})

// pidiendo todos los elementos

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

// pidiendo un elemento

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    console.log(note, 'holaa')
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(err => next(err))
})

// creando nuevo elemnto en notes

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
    data: new Date()
  })
  note.save()
    .then(savedNote => savedNote.toJSON())
    .tnen(saveAndFormattedNote => {
      response.json(saveAndFormattedNote)
    })
    .catch(err => next(err))
})

// eliminado un elemento de notes

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

// actualizando 1 elemnto en MongoDB

app.put('/api/notes/:id', (req, res, next) => {
  const body = req.body

  const note = {
    content: body.content,
    important: body.important
  }

  Note.findByIdAndUpdate(req.params.id, note, { new: true }).then(updatedNote => {
    res.json(updatedNote)
  })
    .catch(err => next(err))
})

// Middleware with unknown endpoint

function unknownEndpoint (request, response) {
  response.status('404').send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint

app.use(unknownEndpoint)

// Middleware to requests with results errors

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err)
}

// handler of requests with results to errors

app.use(errorHandler)

//  creando puerto y escuchando solicitudes en el servidor con dicho puerto

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
