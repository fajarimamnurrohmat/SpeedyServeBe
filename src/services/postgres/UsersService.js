const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");
const bcrypt = require('bcrypt');

class UsersService {
    constructor() {
        this._pool = new Pool();
    }
    
    async verifyNewUsername(username) {
        const query = {
            text: "SELECT username FROM users WHERE username = $1",
            values: [username],
        };
        const result = await this._pool.query(query);
        if (result.rows.length > 0) {
            throw new InvariantError(
            "Gagal menambahkan user. Username sudah digunakan."
            );
        }
    }

    async addUser({ username, password, level }) {
        //Verifikasi username, pastikan belum terdaftar di database
        await this.verifyNewUsername(username);

        const id = nanoid(16);
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = {
            text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
            values: [id, username, hashedPassword, level],
        };
        const result = await this._pool.query(query);
        if (!result.rows[0].id) {
            throw new InvariantError("User gagal ditambahkan");
        }
        return result.rows[0].id;
    }

    async getUsers() {
        const result = await this._pool.query("SELECT * FROM users");
        return result;
    }

    // async getUserById(id) {
    //     const query = {
    //         text: "SELECT * FROM users WHERE id = $1",
    //         values: [id],
    //     };
    //     const result = await this._pool.query(query);
    //     if (!result.rows.length) {
    //         throw new NotFoundError("User tidak ditemukan");
    //     }
    //     return result.rows[0];
    // }

    // async editUserById(id, { username, password, level }) {
    //     const query = {
    //         text: "UPDATE users SET username = $1, password = $2, level = $3 WHERE id = $5 RETURNING id",
    //         values: [username, password, level, id],
    //     };

    //     const result = await this._pool.query(query);

    //     if (!result.rows.length) {
    //         throw new NotFoundError("Gagal memperbarui user. Id tidak ditemukan");
    //     }
    // }

    async deleteUserById(id) {
        const query = {
            text: "DELETE FROM users WHERE id = $1 RETURNING id",
            values: [id],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError("User gagal dihapus. Id tidak ditemukan");
        }
    }
}
module.exports = UsersService;
