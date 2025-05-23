const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");

class CategoryService {
    constructor() {
        this._pool = new Pool();
    }

    async addCategory({ nama_category }) {
        const id_category = nanoid(16);
        const query = {
            text: "INSERT INTO category VALUES($1, $2) RETURNING id_category",
            values: [id_category, nama_category],
        };
        const result = await this._pool.query(query);
        if (!result.rows[0].id_category) {
            throw new InvariantError("Category gagal ditambahkan");
        }
        return result.rows[0].id_category;
    }

    async getCategory() {
        const result = await this._pool.query("SELECT * FROM category");
        return result;
    }

    async editCategoryById(id_category, { nama_category }) {
        const query = {
            text: "UPDATE category SET nama_category = $1 WHERE id_category = $2 RETURNING id_category",
            values: [nama_category, id_category],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError("Gagal memperbarui category. Id tidak ditemukan");
        }
    }

    async deleteCategoryById(id_category) {
        const query = {
            text: "DELETE FROM category WHERE id_category = $1 RETURNING id_category",
            values: [id_category],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError("Category gagal dihapus. Id tidak ditemukan");
        }
    }
}
module.exports = CategoryService;
