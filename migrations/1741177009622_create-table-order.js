/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("order", {
    id_order: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    nama_pemesan: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    no_hp: {
      type: "VARCHAR(15)",
      notNull: false,
    },
    opsi_pesanan: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    total_harga: {
      type: "INTEGER",
      notNull: true,
    },
    jumlah_bayar: {
      type: "INTEGER",
      notNull: true,
    },
    kembalian: {
      type: "INTEGER",
      notNull: true,
    },
    keterangan: {
      type: "TEXT",
      notNull: false,
    },
    status_order: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("order");
};
