const uuid = require('uuid')
const { Address } = require('./Address')

class Person {
  constructor(id, name, age) {
    this.id = id
    this.name = name
    this.age = age
  }
}

const resolver = (people, addresses) => ({
  Query: {
    person(_, { id }) {
      return people[id]
    },
    people(_, { skip = 0, max }) {
      return Object.values(people).slice(skip, max ? skip + max : max)
    },
  },
  Mutation: {
    createPerson(_, { name, age }) {
      const person = new Person(uuid(), name, age)
      people[person.id] = person

      return person
    },
    updatePerson(_, { id, name, age }) {
      if (!people[id]) throw new Error(`No person with id ${id}`)
      if (name) people[id].name = name
      if (age) people[id].age = age

      return people[id]
    },
    addPersonAddress(_, { personId, city, street } = {}) {
      const person = people[personId]
      if (!person) throw new Error(`Person with ID=${personId} not found`)
      const address = new Address(personId, city, street)
      addresses.push(address)
      return address
    }
  },

  Person: {
    addresses(person) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(addresses.filter(address => address.personId == person.id))
        }, 100)
      })
    },
  },
})

module.exports = {
  Person,
  resolver,
}