const resolver = {
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

module.exports = {
  resolver
}