import { Joi } from 'express-validation'

const interger = Joi.number()
  .integer()

const requiredInteger = Joi.number()
  .integer()
  .required()

const string = Joi.string()

const requiredString = Joi.string()
  .required()

export {
  interger,
  requiredInteger,
  string,
  requiredString,
}
