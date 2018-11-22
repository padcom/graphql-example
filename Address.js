class Address {
  constructor(personId, city, street) {
    this.personId = personId
    this.city = city
    this.street = street
  }
}

const resolver = people => ({
  Address: {
    person(address) {
      return people[address.personId]
    },
  },
})

module.exports = {
  Address,
  resolver,
}