const catalog = require('./catalog')

module.exports = {

  /**
   * @description Process a collection of orders
   * @param {Array} orders array of objects
   * @returns {object}
   */
  processOrders (orders) {
    return orders
      .filter(o => catalog.hasProduct(o.code))
      .map(o => {
        const product = catalog.getProduct(o.code)
        const availablePacks = Object.keys(product.packs).map(x => parseInt(x, 10))
        const packsForOrder = this.getPacksForOrder(o.quantity, availablePacks)
        const pricedPacks = this.getPricedPacks(product.packs, packsForOrder)

        return {
          product: o.code,
          quantity: o.quantity,
          packs: pricedPacks
        }
      })
  },

  /**
   * @description retrieves the price of products given the ordered packs
   *
   * @param {any} availablePacks
   * @param {any} orderedPacks
   * @returns  {object}
   */
  getPricedPacks (availablePacks, orderedPacks) {
    const pricedPacks = {}

    Object.keys(orderedPacks).map(op => {
      const price = availablePacks[op]
      pricedPacks[op] = { quantity: orderedPacks[op], packPrice: price }
      return pricedPacks
    })

    return pricedPacks
  },

  /**
   * @description Reduce the packs until a matching quantity is reached
   *
   * @param {any} desiredQuantity
   * @param {any} packs
   * @returns {object}
   */
  getPacksForOrder (desiredQuantity, packs) {
    const sortedPacks = packs.sort((a, b) => a < b)
    const result = {}

    this.buildPackagingOrder(desiredQuantity, sortedPacks, result)

    const total = Object.keys(result).map(r => parseInt(r, 10) * result[r]).reduce((a, b) => a + b)

    if (desiredQuantity !== total) {
      sortedPacks.shift()
      return this.getPacksForOrder(desiredQuantity, sortedPacks)
    }

    return result
  },

  /**
   * @description reduces to a result object that is close to the desired amount
   * @param {any} desired
   * @param {any} packs
   * @param {any} [result={}]
   */
  buildPackagingOrder (desired, packs, result = {}) {
    const pack = Math.max(...packs)
    const remainder = desired % pack
    const totalPacks = parseInt(desired / pack, 10)
    const addToResult = totalPacks > 0 && remainder !== 1
    desired = addToResult ? remainder : desired

    // ASSUMPTION
    // since the bakery decided to sell in packs
    // 1 is an invalid value
    if (addToResult) result[pack] = totalPacks

    if (packs.length) {
      const reducedPacks = packs.slice()
      reducedPacks.shift()

      this.buildPackagingOrder(desired, reducedPacks, result)
    }
  }
}
