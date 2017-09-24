const fs = require('fs')

const shop = require('./shop')
const Order = require('./order')

module.exports.run = (file) => {
  if (!file) {
    console.error('You must supply an input file present under input_1.txt')
    process.exit(1)
  }

  console.log(`Reading data/${file}\r`)

  fs.readFile(`./data/${file}`, 'utf8', (err, data) => {
    if (err) throw err
    const orders = data.split('\n').map(entry => new Order(...entry.split(' ').reverse()))
    const result = shop.processOrders(orders)

    result.forEach(r => {
      const total = Object.keys(r.packs).map(p => {
        return r.packs[p].packPrice * r.packs[p].quantity
      }).reduce((a, b) => a + b, 0)

      console.log(`${r.quantity} ${r.product} $${total.toFixed(2)}`)

      Object.keys(r.packs).map(p => {
        console.log(`\t${r.packs[p].quantity} x ${p} $${r.packs[p].packPrice}`)
      })

      console.log('\r')
    })
  })
}
