const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");

class MenuService {
    constructor() {
        this._pool = new Pool();
    }

    async addMenu({ id_category, nama_menu, harga_menu }) {
        const id_menu = nanoid(16);
        const query = {
            text: "INSERT INTO menu (id_menu, id_category, nama_menu, harga_menu) VALUES($1, $2, $3, $4) RETURNING id_menu",
            values: [id_menu, id_category, nama_menu, harga_menu],
        };
        const result = await this._pool.query(query);
        if (!result.rows[0].id_menu) {
            throw new InvariantError("Menu gagal ditambahkan");
        }
        return result.rows[0].id_menu;
    }

    async getMenu() {
        const query = `
            SELECT menu.id_menu, menu.nama_menu, menu.harga_menu, 
                   category.nama_category 
            FROM menu
            JOIN category ON menu.id_category = category.id_category
        `;
    
        const result = await this._pool.query(query);
        return result.rows;
    }    

    async editMenuById(id_menu, { id_category, nama_menu, harga_menu }) {
        const query = {
            text: "UPDATE menu SET id_category = $1, nama_menu = $2, harga_menu = $3 WHERE id_menu = $4 RETURNING id_menu",
            values: [id_category, nama_menu, harga_menu, id_menu],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError("Gagal memperbarui menu. Id tidak ditemukan");
        }
    }

    async deleteMenuById(id_menu) {
        const query = {
            text: "DELETE FROM menu WHERE id_menu = $1 RETURNING id_menu",
            values: [id_menu],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError("Menu gagal dihapus. Id tidak ditemukan");
        }
    }
}

module.exports = MenuService;
