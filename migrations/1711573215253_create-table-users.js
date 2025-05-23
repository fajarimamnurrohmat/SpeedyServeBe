/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users',{
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        username: {
            type: 'VARCHAR(50)',
            unique: true,
            notNull:true,
        },
        password: {
            type: 'TEXT',
            notNull: true,
        },
        level: {
            type: 'INTEGER',
            notNull: true,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('users');
};
