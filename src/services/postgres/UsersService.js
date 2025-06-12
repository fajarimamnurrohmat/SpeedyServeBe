const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");
const bcrypt = require("bcryptjs");

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

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password, level FROM users WHERE username = $1",
      values: [username],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    const { id, password: hashedPassword, level } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    return { id, level }; // Mengembalikan id dan level user
  }
}
module.exports = UsersService;
