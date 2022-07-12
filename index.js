require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()



const randMax = 100000
morgan.token('JSONcontent', function (req, res) { return JSON.stringify(req.body) })
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :JSONcontent'))
app.use(express.static('build'))


app.get('/info', (req, res) => {
  let sum = 0
  Person.find().count(function (err, count) {
    if (err) {
      console.log(err)
    } else {
      const struc = `<div>
                    <p>Phonebook contains ${count} person(s)<p>
                    </div>
                    <div>
                    <p>${new Date()}<p>
                    </div>
                    `
    res.send(struc)
    }
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

  app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
  
    Note.findByIdAndUpdate(
      request.params.id, 
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    ) 
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })

  app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const note = new Person({
      name: body.name,
      number: body.number,
    })
  
    note.save().then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
  })
  

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError') {
      return response.status(400).send({ error: error.message })
    }
  
    next(error)
  }

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})