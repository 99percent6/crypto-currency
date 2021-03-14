import { Joi } from 'express-validation'
import { requiredString } from '../../lib/validation'

const currencyValidation = {
  query: Joi.object({
    fsyms: requiredString,
    tsyms: requiredString,
  }),
}

export {
  currencyValidation,
}
