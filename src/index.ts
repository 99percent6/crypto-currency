import express from 'express'
import cors from 'cors'
import config from 'config'
import { ValidationError } from 'express-validation'
import logger from './lib/logger'
import { errorHandler } from './middlewares'
import routes from './routes'
import DB from './lib/db'
import { sendError } from './lib/utils'
import CryptoCompare from './lib/cryptoCompare'
import MySql from '../scripts/MySql'

const app = express()
const db = new DB()
const CryptoCurrency = new CryptoCompare()
const updateInterval: number = config.get('cryptoCompare.updateInterval')

app.use(express.json({
  limit: config.get('bodyParser.limit'),
}))
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler)
app.use(cors({
  exposedHeaders: config.get('corsHeaders'),
}))
app.use('/api', routes({ config, db, app }))
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.locals.error = err
    let error = ''
    Object.keys(err.details[0]).forEach((key) => {
      error = err.details[0][key].replace(/"/g, '')
    })
    return sendError({ res, message: error, code: err.statusCode })
  }
  return sendError({ res, message: err, code: res.statusCode })
})

MySql.createTables()

setInterval(() => {
  CryptoCurrency.updateDataFromApi()
}, updateInterval)

const port: string = config.get('server.port')
const host: string = config.get('server.host')
app.listen(parseInt(port, 10), host, () => {
  logger.info(`Cryptocurrency API started at http://${host}:${port}.`)
})

export default app
