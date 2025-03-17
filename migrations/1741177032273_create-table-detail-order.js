/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable("detail_order", {
        id_detail_order: {
            type: "VARCHAR(20)",
            primaryKey: true,
        },
        id_order: {
            type: "VARCHAR(50)",
            notNull: true,
            references: '"order"(id_order)',
            onDelete: "CASCADE",
        },
        id_menu: {
            type: "VARCHAR(16)",
            notNull: true,
            references: '"menu"(id_menu)',
            onDelete: "RESTRICT",
        },
        jumlah: {
            type: "INTEGER",
            notNull: true,
        },
        subtotal: {
            type: "NUMERIC(10,2)",
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("detail_order");
};
