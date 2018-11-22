#!/usr/bin/env node

const { buildSchema } = require('graphql')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const uuid = require('uuid')

const schema = buildSchema(`
  type Person {
    id: ID!
    name: String!
    age: Int!
  }

  type Query {
    hello: String
    rollDice(num: Int!, sides: Int): [Int]
    person(id: Int!): Person
    people: [Person!]
  }

  type Mutation {
    createPerson(name: String!, age: Int!): Person!
  }
`)

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

const root = {
  hello() {
    return 'Hello, world!'
  },
  rollDice({ num, sides = 6 }) {
    return [ Math.round(Math.random() * sides) ]
  },
  person({ id }) {
    return people[id]
  },
  people() {
    return Object.keys(people).map(id => people[id])
  },
  createPerson({ name, age }) {
    const person = new Person(uuid(), name, age)
    people[person.id] = person

    return person
  }
}

const app = express()
app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }))
app.listen(3000, () => { console.log('Server listening on port 3000') })
