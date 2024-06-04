const Joi = require("joi");
const UserPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    level: Joi.number().required(),
});
module.exports = { UserPayloadSchema };
