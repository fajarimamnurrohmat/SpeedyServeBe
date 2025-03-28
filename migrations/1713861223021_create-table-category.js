/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('category',{
        id_category: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        nama_category: {
            type: 'VARCHAR(50)',
            notNull:true,
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('category');
};
