const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


const url =
  `mongodb+srv://Nubezzi:${password}@phonebook.mp1oarq.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Note = mongoose.model('Note', noteSchema)

if (process.argv.length==3) {
    console.log("phonebook: ")
    Note.find({}).then(result => {
        result.forEach(note => {
          console.log(`${note.name} ${note.number}`)
        })
        mongoose.connection.close()
      })
}

const namePerson = process.argv[3]
const numberPerson = process.argv[4]

const note = new Note({
  name: namePerson,
  number: numberPerson,
})

note.save().then(result => {
  console.log(`added ${namePerson} number ${numberPerson} to phonebook`)
  mongoose.connection.close()
})