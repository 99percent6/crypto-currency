import { Router } from 'express'
import currencyRoute from './currency'

export default ({ config, db, app }) => {
  const routes = Router()

  routes.use('/currency', currencyRoute({ config, db, app }).currencyApi)
  routes.use('/currency', currencyRoute({ config, db, app }).wsCurrencyApi)

  return routes
}
