/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("transaksi", {
        id_transaksi: {
            type: "VARCHAR(20)",
            primaryKey: true,
        },
        id_order: {
            type: "VARCHAR(50)",
            notNull: true,
            references: '"order"(id_order)',
            onDelete: "CASCADE",
        },
        waktu: {
            type: "TIMESTAMP",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP"),
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("transaksi");
};
