const fs = require('fs')
const path = require('path')

const Order = require('./order')
const shop = require('./shop')

const logErrorAndExit = (msg) => {
  console.error(msg)
  process.exit(1)
}

module.exports.run = (file) => {
  if (!file) {
    return logErrorAndExit('You must supply an input file present under "data" folder.')
  }

  const dataFile = path.join(process.cwd(), 'data', file)

  const promise = new Promise((resolve, reject) => {
    fs.stat(dataFile, (err, data) => {
      if (err) return reject(err.message)

      fs.readFile(dataFile, 'utf8', (err, data) => {
        if (err) return reject(err.message)

        if (!data) return resolve('Nothing to process.')

        const orders = data.split('\n').map(entry => new Order(...entry.split(' ').reverse()))
        const result = shop.processOrders(orders)

        if (!result.length) return resolve('No valid products to sell.')

        const resultOutput = []

        result.forEach(r => {
          const total = Object.keys(r.packs)
            .map(p => r.packs[p].packPrice * r.packs[p].quantity)
            .reduce((a, b) => a + b, 0)

          resultOutput.push(`${r.quantity} ${r.product} $${total.toFixed(2)}`)

          Object.keys(r.packs).map(p => {
            resultOutput.push(`\t${r.packs[p].quantity} x ${p} $${r.packs[p].packPrice}`)
          })
        })

        resolve(resultOutput.join('\n\r'))
      })
    })
  })

  Promise.resolve(promise.then(console.log).catch(logErrorAndExit))
}
