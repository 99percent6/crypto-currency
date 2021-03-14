import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../../src'

const should = chai.should()

chai.use(chaiHttp)

describe('Cryptocurrency', () => {
  it('Get price', function (done) {
    chai.request(server)
      .get('/api/currency/price?fsyms=BTC&tsyms=USD')
      .end((err, res) => {
        res.should.have.status(200)
        done()
      })
  })
})
