const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
//kommentti
const app = express()
const randMax = 100000
morgan.token('JSONcontent', function (req, res) { return JSON.stringify(req.body) })
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :JSONcontent'))
app.use(express.static('build'))

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
    
  ]

app.get('/info', (req, res) => {
    const amount = persons.length
    const struc = `<div>
                    <p>Phonebook contains ${amount} person(s)<p>
                    </div>
                    <div>
                    <p>${new Date()}<p>
                    </div>
                    `
    res.send(struc)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(per => per.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

const generateId = () => {
    return Math.floor(Math.random() * randMax)
  }

app.post('/api/persons', (request, response) => {
  const body = request.body
  const wasfound = persons.find(per => per.name === body.name)
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }else if (persons.filter(e => e.name === body.name).length > 0) {
    return response.status(400).json({ 
        error: 'name must be unique' 
      })
  }
 ///
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(per => per.id !== id)
  
    response.status(204).end()
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})