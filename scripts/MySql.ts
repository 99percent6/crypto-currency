import fs from 'fs'
import logger from '../src/lib/logger'
import DB from '../src/lib/db'

export default class MySql {
  private static LOGGER_PREFIX = 'MYSQL: '

  public static async createTables(): Promise<void> {
    const db = new DB()
    db.connect()
    try {
      const sql = fs.readFileSync('scripts/sql/tables.sql').toString()
      await db.query(sql)
      logger.info(this.LOGGER_PREFIX, 'Tables were created successfully')
    } catch (error) {
      logger.error(this.LOGGER_PREFIX, error.message || error)
    }
    db.close()
  }
}
