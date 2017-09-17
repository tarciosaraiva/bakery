const catalog = require('../src/catalog')
const products = require('../src/catalog.json')

describe('Catalog', () => {
  describe('#hasProduct', () => {
    it('is true when product is available', () => {
      expect(catalog.hasProduct('VS5')).to.eql(true)
    })

    it('is false when product is not available', () => {
      expect(catalog.hasProduct('ABC')).to.eql(false)
    })
  })

  describe('#getProduct', () => {
    it('retrieve single product record when product code exists', () => {
      expect(catalog.getProduct('VS5')).to.eql(products[0])
    })

    it('returns "undefined" when product code does not exist', () => {
      expect(catalog.getProduct('AWS')).to.eql(undefined)
    })
  })
})
