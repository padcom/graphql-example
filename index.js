#!/usr/bin/env node

// Example query using cURL
// curl -X POST --data '{ "query": "{ people { id, name, age } }" }' --header "Content-Type: application/json" localhost:3000/graphql

const { GraphQLServer } = require('graphql-yoga')
const { importSchema } = require('graphql-import')

const { resolver: helloResolvers } = require('./Hello')
const { resolver: diceResolvers } = require('./Dice')
const { Person, resolver: personResolvers } = require('./Person')
const { Address, resolver: addressResolvers } = require('./Address')

const people = {
  1: new Person(1, 'John Doe', 43),
  2: new Person(2, 'Jane Smith', 25),
  3: new Person(3, 'Clif Richards', 55),
}

const addresses = [
  new Address(1, 'New York', '1st street')
]

const resolvers = [ helloResolvers, diceResolvers, personResolvers(people, addresses), addressResolvers(people) ]

const typeDefs = importSchema('./schema.graphql')
console.log(typeDefs)

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server listening on port 4000'))
