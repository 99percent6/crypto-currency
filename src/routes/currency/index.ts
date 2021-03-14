import { Router, Express } from 'express'
import expressWs from 'express-ws'
import { IConfig } from 'config'
import { validate } from 'express-validation'
import DB from '../../lib/db'
import { sendError, sendResponse } from '../../lib/utils'
import CryptoCompare from '../../lib/cryptoCompare'
import { currencyValidation } from './validation'
import logger from '../../lib/logger'

export default ({ app }: { config?: IConfig, db?: DB, app?: Express }) => {
  const currencyApi = Router()
  const wsCurrencyApi = expressWs(app)
  const CryptoCurrency = new CryptoCompare()
  const LOGGER_PREFIX = 'CURRENCY: '
  const validationOptions = {
    context: true,
    keyByField: true,
  }

  currencyApi.get('/price', validate(currencyValidation, validationOptions), async (req, res) => {
    try {
      const fsyms = req.query.fsyms as string
      const tsyms = req.query.tsyms as string
      const result = await CryptoCurrency.getPriceMultiFull(fsyms, tsyms)
      const preparedData = CryptoCurrency.extractRequiredFields(result)
      sendResponse({ res, result: [null, preparedData] })
      return CryptoCurrency.saveInDb(result)
    } catch (error) {
      return sendError({ res, message: error.message || error, LOGGER_PREFIX })
    }
  })

  wsCurrencyApi.app.ws('/price', (ws, req) => {
    ws.on('message', async (message) => {
      try {
        const body = JSON.parse(message as string)
        if (body.fsyms === undefined || body.tsyms === undefined) {
          return ws.send(JSON.stringify(['Missing required fields - fsyms or tsyms', null]))
        }
        let { fsyms, tsyms }: { fsyms: string, tsyms: string } = body
        fsyms = fsyms.split(',').map((item) => item.trim()).join(',')
        tsyms = tsyms.split(',').map((item) => item.trim()).join(',')
        const result = await CryptoCurrency.getPriceMultiFull(fsyms, tsyms)
        const preparedData = CryptoCurrency.extractRequiredFields(result)
        return ws.send(JSON.stringify([null, preparedData]))
      } catch (error) {
        logger.error(LOGGER_PREFIX, error)
        return ws.send(JSON.stringify([error.message || error, null]))
      }
    })

    ws.on('error', (err) => {
      logger.error(LOGGER_PREFIX, 'Websocket error - ', err)
    })
  })

  return {
    currencyApi,
    wsCurrencyApi: wsCurrencyApi.app,
  }
}
