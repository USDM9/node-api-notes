
const express = require('express')
const notes = require('./db')
const app = express()
const cors = require('cors')

app.use(express.json())

// Middleware cors

app.use(express.static('build'))

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
  response.json(notes)
})

// pidiendo un elemento

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => {
    // console.log(note.id, typeof note.id, id, typeof id, note.id === id)
    return note.id === id
  })

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// creando nuevo elemnto en notes

function generateId () {
  const ids = notes.length > 0 ? notes.map(n => n.id) : 0
  const maxId = ids === 0 ? ids : Math.max(...ids)
  return maxId
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const note = {
    content: body.content,
    import: body.important || false,
    data: new Date(),
    id: generateId() + 1
  }

  notes.push(note)

  console.log(notes)
  response.json(note)
})

// eliminado un elemento de notes

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const index = notes.findIndex(note => note.id === id)
  notes.splice(index, 1)
  response.status(204).end()
})

// Middleware en accion

function unknownEndpoint (request, response) {
  response.status('404').send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//  creando puerto y escuchando solicitudes en el servidor con dicho puerto

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
