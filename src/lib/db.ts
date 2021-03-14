import mysql from 'mysql'
import config from 'config'
import logger from './logger'

export default class DB {
  private host: string = config.get('db.host')

  private user: string = config.get('db.user')

  private password: string = config.get('db.password')

  private database: string = config.get('db.database')

  private connection: mysql.Connection

  private readonly LOGGER_PREFIX = 'MySQL connection: '

  constructor() {
    this.connection = mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
    })
  }

  public connect() {
    this.connection.connect((err) => {
      if (err) {
        logger.error(this.LOGGER_PREFIX, err)
        this.connect()
        return
      }
      logger.info(this.LOGGER_PREFIX, `connected as id ${this.connection.threadId}`)
    })
  }

  public query(query: string, data: any = null): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(query, data, (error, result) => {
        if (error) {
          return reject(error)
        }
        return resolve(result)
      })
    })
  }

  public async delete(
    { table, key, value }: { table: string, key: string, value: number | string },
  ): Promise<any> {
    const query = `DELETE FROM ${table} WHERE ${key} = ?`
    return this.query(query, value)
  }

  public close() {
    this.connection.end()
  }
}
