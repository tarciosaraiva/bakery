const fs = require('fs')
const path = require('path')
const sinon = require('sinon')

const manager = require('../src/manager')

const fileWithData = path.join(process.cwd(), 'data', 'file.txt')

describe('Manager', () => {
  beforeEach(() => {
    sinon.spy(console, 'log')
    sinon.spy(console, 'error')
  })

  afterEach(() => {
    console.log.restore()
    console.error.restore()
  })

  describe('when no file passed in', () => {
    beforeEach(() => {
      sinon.stub(process, 'exit')
    })

    afterEach(() => {
      process.exit.restore()
    })

    it('should exit with code 1', () => {
      manager.run()
      expect(console.error).to.have.been.calledWith('You must supply an input file present under "data" folder.')
      expect(process.exit).to.have.been.calledWith(1)
    })
  })

  describe('when file passed in as argument does not exist', () => {
    beforeEach(() => {
      sinon.stub(process, 'exit')
    })

    afterEach(() => {
      process.exit.restore()
    })

    it('exits with code 1 and logs file does not exist', done => {
      manager.run('input.txt')
      setTimeout(_ => {
        expect(console.error).to.have.been.calledWith("ENOENT: no such file or directory, stat '/home/tarcio/workspace/personal/bakery/data/input.txt'")
        expect(process.exit).to.have.been.calledWith(1)
        done()
      }, 1)
    })
  })

  describe('when file passed in as argument exits', () => {
    describe('and file is corrupted somehow', () => {
      beforeEach(() => {
        sinon.stub(process, 'exit')
        sinon.stub(fs, 'readFile').yields(new Error('corrupted'))
      })

      afterEach(() => {
        process.exit.restore()
        fs.readFile.restore()
      })

      it('exits with code 1 and error message', done => {
        manager.run('input_1.txt')
        setTimeout(_ => {
          expect(console.error).to.have.been.calledWith('corrupted')
          expect(process.exit).to.have.been.calledWith(1)
          done()
        }, 1)
      })
    })

    describe('and data file is empty', () => {
      beforeEach(() => {
        sinon.stub(fs, 'stat').yields(null)
        sinon.stub(fs, 'readFile').yields(null, '')
      })

      afterEach(() => {
        fs.stat.restore()
        fs.readFile.restore()
      })

      it('finishes the process with a "Nothing to process" message', done => {
        manager.run('file.txt')
        setTimeout(_ => {
          expect(fs.stat).to.have.been.calledWith(fileWithData)
          expect(console.log).to.have.been.calledWith('Nothing to process.')
          done()
        }, 1)
      })
    })

    describe('and entries are invalid', () => {
      beforeEach(() => {
        sinon.stub(fs, 'stat').yields(null)
        sinon.stub(fs, 'readFile').yields(null, 'VB5 10\nCF 3\n')
      })

      afterEach(() => {
        fs.stat.restore()
        fs.readFile.restore()
      })

      it('finishes the process with a "No valid products to sell" message', done => {
        manager.run('file.txt')
        setTimeout(_ => {
          expect(fs.stat).to.have.been.calledWith(fileWithData)
          expect(console.log).to.have.been.calledWith('No valid products to sell.')
          done()
        }, 1)
      })
    })

    describe('and entries are valid', () => {
      beforeEach(() => {
        sinon.stub(fs, 'stat').yields(null)
        sinon.stub(fs, 'readFile').yields(null, '10 VS5\n3 CF\n')
      })

      afterEach(() => {
        fs.stat.restore()
        fs.readFile.restore()
      })

      it('finishes the process with an order summary', done => {
        manager.run('file.txt')
        setTimeout(_ => {
          expect(fs.stat).to.have.been.calledWith(fileWithData)
          expect(console.log).to.have.been.calledWith('10 VS5 $17.98\n\r\t2 x 5 $8.99\n\r3 CF $5.95\n\r\t1 x 3 $5.95')
          done()
        }, 1)
      })
    })
  })
})
