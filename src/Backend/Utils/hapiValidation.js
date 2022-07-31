const joi = require("@hapi/joi");

const userRegisterValidation = joi.object({
  name: joi.string().min(3).required(),
  email: joi.string().min(5).required().email(),
  password: joi.string().min(8).required(),
});
const userLoginValidation = joi.object({
  email: joi.string().min(5).required().email(),
  password: joi.string().min(5).required(),
});
module.exports = { userRegisterValidation, userLoginValidation };
