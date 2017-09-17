module.exports = class Order {
  constructor (productCode, quantity) {
    this.code = productCode
    this.quantity = parseInt(quantity, 10)
  }
}
