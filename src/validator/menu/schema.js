const Joi = require("joi");

const MenuPayloadSchema = Joi.object({
    id_category: Joi.string(),
    nama_menu: Joi.string().required(), 
    harga_menu: Joi.number().positive().required(), // Harga harus angka positif dan wajib diisi
});

module.exports = { MenuPayloadSchema };
