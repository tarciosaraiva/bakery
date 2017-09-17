const products = require('./catalog.json')

module.exports = {

  /**
   * @description Look up catalog for a product
   * @param {any} productCode
   * @returns {boolean}
   */
  hasProduct (productCode) {
    return products.map(p => p.code).includes(productCode)
  },

  /**
   * @description Finds a single product by its product code
   * @param {any} productCode
   * @returns  the product record or undefined
   */
  getProduct (productCode) {
    return products.find(p => p.code === productCode)
  }
}
