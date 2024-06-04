const Joi = require("joi");
const CategoryPayloadSchema = Joi.object({
    nama_category: Joi.string().required(),
});
module.exports = { CategoryPayloadSchema};
