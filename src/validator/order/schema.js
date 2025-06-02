const Joi = require("joi");

const OrderPayloadSchema = Joi.object({
  nama_pemesan: Joi.string().required(),
  no_hp:Joi.string().allow("").optional(), // Hanya angka
  opsi_pesanan: Joi.string().valid("Dine In", "Take Away").required(), // Hanya bisa "Dine In" atau "Take Away"
  jumlah_bayar: Joi.number().positive().required(),
  keterangan: Joi.string().allow("").optional(), // Bisa kosong
  detail_pesanan: Joi.array()
    .items(
      Joi.object({
        id_menu: Joi.string().required(),
        jumlah: Joi.number().integer().positive().required(),
      })
    )
    .min(1) // Minimal harus ada satu pesanan
    .required(),
});

const DetailOrderPayloadSchema = Joi.object({
  id_order: Joi.string().required(),
  id_menu: Joi.string().required(),
  jumlah: Joi.number().integer().positive().required(),
  subtotal: Joi.number().positive().required(),
});

// Schema untuk update status order
const UpdateStatusOrderSchema = Joi.object({
  status_order: Joi.string()
    .valid("Dalam Antrian", "Sedang Diproses", "Selesai")
    .required(),
});

module.exports = { OrderPayloadSchema, DetailOrderPayloadSchema, UpdateStatusOrderSchema };
