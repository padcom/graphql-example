#!/usr/bin/env node

// Example query using cURL
// curl -X POST --data '{ "query": "{ people { id, name, age } }" }' --header "Content-Type: application/json" localhost:3000/graphql

const { GraphQLServer } = require('graphql-yoga')
const uuid = require('uuid')
const { importSchema } = require('graphql-import')

class Person {
  constructor(id, name, age) {
    this.id = id
    this.name = name
    this.age = age
  }
}

const people = {
  1: new Person(1, 'John Doe', 43),
}

class Address {
  constructor(personId, city, street) {
    this.personId = personId
    this.city = city
    this.street = street
  }
}

const addresses = [
  new Address(1, 'New York', '1st street')
]

const helloResolvers = {
  Query: {
    hello() {
      return 'Hello, world!'
    },
  }
}

const diceResolvers = {
  Query: {
    rollDice(_, { num, sides = 6 }) {
      const result = []
      for (let i = 0; i < num; i++) {
        result.push(Math.round(Math.random() * sides))
      }
      return result
    },
  }
}

const personResolvers = {
  Query: {
    person(_, { id }) {
      return people[id]
    },
    people() {
      return Object.values(people)
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
      return addresses.filter(address => address.personId == person.id)
    },
  },
}

const addressResolvers = {
  Address: {
    person(address) {
      return people[address.personId]
    },
  },
}


const resolvers = [ helloResolvers, diceResolvers, personResolvers, addressResolvers ]

const typeDefs = importSchema('./schema.graphql')
console.log(typeDefs)

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server listening on port 4000'))
