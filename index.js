const manager = require('./src/manager')

const fileArgument = process.argv.splice(2)[0]
manager.run(fileArgument)
