const manager = require('./src/manager')

const file = process.argv.splice(2)[0]
manager.run(file)
