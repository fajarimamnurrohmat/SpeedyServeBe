const Joi = require("joi");

const TransactionPayloadSchema = Joi.object({
  id_order: Joi.string().required(), // ID Order wajib diisi dan harus string
});

module.exports = { TransactionPayloadSchema };
