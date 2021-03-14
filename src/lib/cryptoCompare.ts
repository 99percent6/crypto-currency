import config from 'config'
import rp from 'request-promise'
import logger from './logger'
import DB from './db'
import { CurrencyDbRecord } from '../types/currency'

type Urls = {
  multiFull: string,
}

type Data = {
  RAW: Record<string, Record<string, string | number>>,
  DISPLAY: Record<string, Record<string, string | number>>,
}

export default class CryptoCompare {
  private urls: Urls = config.get('cryptoCompare.url')

  private tableName: string = config.get('cryptoCompare.tableName')

  private LOGGER_PREFIX = 'CRYPTO COMPARE: '

  public async getPriceMultiFull(fsyms: string, tsyms: string): Promise<Data> {
    const url = `${this.urls.multiFull}?fsyms=${fsyms}&tsyms=${tsyms}`
    let result: Data = null
    try {
      result = await this.loadFromApi(url)
    } catch (error) {
      logger.error(this.LOGGER_PREFIX, error)
      logger.info('Load data from database')
      result = await this.getFromDb(fsyms.split(','), tsyms.split(','))
    }
    return result
  }

  private async loadFromApi(url: string): Promise<Data> {
    const result: Data = await rp.get(url, {
      json: true,
    })
    return result
  }

  private async hasCurrencyPair(
    cryptoCurrency: string,
    currency: string,
    type: string,
    db: DB,
  ): Promise<boolean> {
    const query = `SELECT id FROM ${this.tableName} WHERE crypto_currency = ? AND currency = ? AND type = ?`
    const data = [cryptoCurrency, currency, type]
    try {
      const result = await db.query(query, data)
      return result.length > 0
    } catch (error) {
      logger.error(this.LOGGER_PREFIX, error)
      return false
    }
  }

  public async saveInDb(data: Data): Promise<void> {
    if (data === null) {
      logger.error(this.LOGGER_PREFIX, 'Error saving data in database, data is null')
      return
    }
    await this._saveInDb(data)
  }

  private convertToData(records: CurrencyDbRecord[]): Data {
    const result: Data = { RAW: {}, DISPLAY: {} }
    records.forEach((record) => {
      try {
        if (result[record.type][record.crypto_currency] === undefined) {
          result[record.type][record.crypto_currency] = {
            [record.currency]: JSON.parse(record.data),
          }
        } else {
          result[record.type][record.crypto_currency][record.currency] = JSON.parse(record.data)
        }
      } catch (error) {
        logger.error(this.LOGGER_PREFIX, error)
      }
    })
    return result
  }

  public extractRequiredFields(data: Data): Data {
    const copy: Data = { RAW: {}, DISPLAY: {} }
    const requiredFields: string[] = config.get('cryptoCompare.requiredFields')
    Object.keys(data).forEach((type) => {
      Object.keys(data[type]).forEach((cryptoCurrency) => {
        if (copy[type][cryptoCurrency] === undefined) {
          copy[type][cryptoCurrency] = {}
        }
        Object.keys(data[type][cryptoCurrency]).forEach((currency) => {
          if (copy[type][cryptoCurrency][currency] === undefined) {
            copy[type][cryptoCurrency][currency] = {}
          }
          Object.keys(data[type][cryptoCurrency][currency]).forEach((field) => {
            if (requiredFields.includes(field.toLowerCase())) {
              copy[type][cryptoCurrency][currency][field] = data[type][cryptoCurrency][currency][field]
            }
          })
        })
      })
    })
    return copy
  }

  public async getFromDb(fsyms: string[], tsyms: string[]): Promise<Data> {
    const types = ['RAW', 'DISPLAY']
    const cryptoCurrencyFields = fsyms.map((item) => 'crypto_currency = ?').join(' OR ')
    const currencyFields = tsyms.map((item) => 'currency = ?').join(' OR ')
    const typeFields = types.map((item) => 'type = ?').join(' OR ')
    const query = `SELECT * FROM ${this.tableName} WHERE (${cryptoCurrencyFields}) AND (${currencyFields}) AND (${typeFields})`
    const data = [...fsyms, ...tsyms, ...types]
    try {
      const db = new DB()
      db.connect()
      const records = await db.query(query, data)
      return this.convertToData(records)
    } catch (error) {
      logger.error(this.LOGGER_PREFIX, error)
      return null
    }
  }

  private async _saveInDb(data: Data) {
    const db = new DB()
    db.connect()
    for (const type in data) {
      for (const cryptoCurrency in data[type]) {
        for (const currency in data[type][cryptoCurrency]) {
          const hasCurrencyPair = await this.hasCurrencyPair(cryptoCurrency, currency, type, db)
          let record
          let query
          if (hasCurrencyPair) {
            query = `UPDATE ${this.tableName} SET data = ? WHERE crypto_currency = ? AND currency = ? AND type = ?`
            record = [
              JSON.stringify(data[type][cryptoCurrency][currency]),
              cryptoCurrency,
              currency,
              type,
            ]
          } else {
            query = `INSERT INTO ${this.tableName} SET ?`
            record = {
              crypto_currency: cryptoCurrency,
              currency,
              type,
              data: JSON.stringify(data[type][cryptoCurrency][currency]),
            }
          }

          try {
            await db.query(query, record)
          } catch (error) {
            logger.error(this.LOGGER_PREFIX, error)
          }
        }
      }
    }
    db.close()
  }

  public async updateDataFromApi(): Promise<void> {
    const fsyms: string[] = config.get('cryptoCompare.fsyms')
    const tsyms: string[] = config.get('cryptoCompare.tsyms')
    const url = `${this.urls.multiFull}?fsyms=${fsyms.join(',')}&tsyms=${tsyms.join(',')}`
    try {
      logger.info(this.LOGGER_PREFIX, 'Regular update started')
      const result = await this.loadFromApi(url)
      await this.saveInDb(result)
      logger.info(this.LOGGER_PREFIX, 'Regular update completed successfully')
    } catch (error) {
      logger.error(this.LOGGER_PREFIX, error)
    }
  }
}
