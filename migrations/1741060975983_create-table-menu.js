/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('menu', {
        id_menu: {
            type: 'VARCHAR(16)',
            primaryKey: true,
        },
        id_category: {
            type: 'VARCHAR(16)',
            notNull: true,
            references: '"category"(id_category)',
            onDelete: 'RESTRICT',
        },
        nama_menu: {
            type: 'TEXT',
            notNull: true,
        },
        harga_menu: {
            type: 'NUMERIC(10,2)',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('menu');
};
