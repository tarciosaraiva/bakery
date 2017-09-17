const sinon = require('sinon')

const shop = require('../src/shop')
const Order = require('../src/order')
const catalog = require('../src/catalog')

describe('Shop', () => {
  describe('#processOrders', () => {
    let result

    beforeEach(() => {
      const orders = [
        new Order('VS5', 10), new Order('MB11', 14), new Order('CF', 13), new Order('AA', 1)
      ]
      sinon.spy(catalog, 'hasProduct')
      sinon.spy(catalog, 'getProduct')
      result = shop.processOrders(orders)
    })

    afterEach(() => {
      catalog.hasProduct.restore()
      catalog.getProduct.restore()
    })

    it('skips the unknown product', () => {
      expect(catalog.hasProduct).to.have.been.calledWith('AA')
      expect(catalog.getProduct).to.not.have.been.calledWith('AA')
    })

    it('produces an object with packs per order', () => {
      expect(result).to.eql([
        { product: 'VS5', quantity: 10, packs: { '5': { quantity: 2, packPrice: 8.99 } } },
        { product: 'MB11', quantity: 14, packs: { '8': { quantity: 1, packPrice: 24.95 }, '2': { quantity: 3, packPrice: 9.95 } } },
        { product: 'CF', quantity: 13, packs: { '5': { quantity: 2, packPrice: 9.95 }, '3': { quantity: 1, packPrice: 5.95 } } }
      ])
    })
  })

  describe('#getPricedPacks', () => {
    it('generates a collection of priced packs', () => {
      const result = shop.getPricedPacks({ '3': 5.95, '5': 9.95 }, { '5': 2 })
      expect(result).to.eql({ '5': { quantity: 2, packPrice: 9.95 } })
    })
  })

  describe('#getPacksForOrder', () => {
    [
      { qty: 10, packs: [3, 5], expected: { '5': 2 } },
      { qty: 14, packs: [2, 5, 8], expected: { '8': 1, '2': 3 } },
      { qty: 13, packs: [3, 5, 9], expected: { '5': 2, '3': 1 } },
      { qty: 15, packs: [3, 5], expected: { '5': 3 } },
      { qty: 16, packs: [2, 5, 8], expected: { '8': 2 } },
      { qty: 21, packs: [3, 5, 9], expected: { '9': 2, '3': 1 } }
    ].forEach(x => {
      it(`reduces to the least amount of packs for ${x.qty} when packs [${x.packs}] are available`, () => {
        const result = shop.getPacksForOrder(x.qty, x.packs)
        expect(result).to.eql(x.expected)
      })
    })
  })

  describe('#buildPackagingOrder', () => {
    [
      { qty: 10, packs: [3, 5], expected: { '5': 2 } },
      { qty: 14, packs: [2, 5, 8], expected: { '8': 1 } },
      { qty: 13, packs: [3, 5, 9], expected: { '9': 1 } },
      { qty: 15, packs: [3, 5], expected: { '5': 3 } },
      { qty: 16, packs: [2, 5, 8], expected: { '8': 2 } },
      { qty: 21, packs: [3, 5, 9], expected: { '9': 2 } }
    ].forEach(x => {
      it(`reduces to a result that closely resembles the amount desired ${x.qty} when pack [${x.packs}] are available`, () => {
        const result = {}
        shop.buildPackagingOrder(x.qty, x.packs, result)
        expect(result).to.eql(x.expected)
      })
    })
  })
})
