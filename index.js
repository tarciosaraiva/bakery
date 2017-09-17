const fs = require('fs')

const shop = require('./src/shop')
const Order = require('./src/order')

console.log('Reading data/input_1.txt')

fs.readFile('./data/input_1.txt', 'utf8', (err, data) => {
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
