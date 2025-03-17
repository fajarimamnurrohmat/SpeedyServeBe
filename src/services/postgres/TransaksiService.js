const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const NotFoundError = require("../../exceptions/NotFoundError");
const InvariantError = require("../../exceptions/InvariantError");

class TransaksiService {
    constructor() {
        this._pool = new Pool();
    }

    // Menambahkan transaksi baru
    async addTransaksi({ id_order }) {
        const id_transaksi = nanoid(16);
    
        // Mulai transaksi database
        const client = await this._pool.connect();
    
        try {
            await client.query("BEGIN"); // Memulai transaksi
    
            // 1️⃣ Menambahkan transaksi ke tabel transaksi
            const insertQuery = {
                text: "INSERT INTO transaksi (id_transaksi, id_order) VALUES ($1, $2) RETURNING id_transaksi",
                values: [id_transaksi, id_order],
            };
            const result = await client.query(insertQuery);
    
            if (!result.rows[0].id_transaksi) {
                throw new InvariantError("Transaksi gagal ditambahkan");
            }
    
            // 2️⃣ Mengubah status_order menjadi 'Selesai'
            const updateQuery = {
                text: "UPDATE \"order\" SET status_order = 'Selesai' WHERE id_order = $1",
                values: [id_order],
            };
            await client.query(updateQuery);
    
            await client.query("COMMIT"); // Commit transaksi
    
            return result.rows[0].id_transaksi;
        } catch (error) {
            await client.query("ROLLBACK"); // Batalkan transaksi jika ada error
            throw error;
        } finally {
            client.release(); // Kembalikan koneksi ke pool
        }
    }
    

    // Mendapatkan semua transaksi dengan detail pesanan
    async getTransaksi() {
        // Query untuk mengambil transaksi
        const transaksiQuery = `
            SELECT t.id_transaksi, t.waktu, 
                   o.id_order, o.nama_pemesan, o.total_harga, o.status_order
            FROM transaksi t
            JOIN "order" o ON t.id_order = o.id_order
            ORDER BY t.waktu DESC
        `;
        const transaksiResult = await this._pool.query(transaksiQuery);
        const transaksiList = transaksiResult.rows;

        // Ambil detail pesanan untuk setiap transaksi
        for (let transaksi of transaksiList) {
            const detailQuery = {
                text: `
                    SELECT d.id_detail_order, d.id_menu, m.nama_menu, d.jumlah, d.subtotal
                    FROM detail_order d
                    JOIN menu m ON d.id_menu = m.id_menu
                    WHERE d.id_order = $1
                `,
                values: [transaksi.id_order],
            };
            const detailResult = await this._pool.query(detailQuery);
            transaksi.detail_pesanan = detailResult.rows;
        }

        return transaksiList;
    }

    // Mendapatkan transaksi berdasarkan ID dengan detail pesanan
    async getTransaksiById(id_transaksi) {
        const transaksiQuery = {
            text: `
                SELECT t.id_transaksi, t.waktu, 
                       o.id_order, o.nama_pemesan, o.total_harga, o.status_order
                FROM transaksi t
                JOIN "order" o ON t.id_order = o.id_order
                WHERE t.id_transaksi = $1
            `,
            values: [id_transaksi],
        };
        const transaksiResult = await this._pool.query(transaksiQuery);
        if (!transaksiResult.rows.length) {
            throw new NotFoundError("Transaksi tidak ditemukan");
        }
        const transaksi = transaksiResult.rows[0];

        // Ambil detail pesanan
        const detailQuery = {
            text: `
                SELECT d.id_detail_order, d.id_menu, m.nama_menu, d.jumlah, d.subtotal
                FROM detail_order d
                JOIN menu m ON d.id_menu = m.id_menu
                WHERE d.id_order = $1
            `,
            values: [transaksi.id_order],
        };
        const detailResult = await this._pool.query(detailQuery);
        transaksi.detail_pesanan = detailResult.rows;

        return transaksi;
    }

    // Menghapus transaksi berdasarkan ID
    async deleteTransaksiById(id_transaksi) {
        const query = {
            text: "DELETE FROM transaksi WHERE id_transaksi = $1 RETURNING id_transaksi",
            values: [id_transaksi],
        };
        const result = await this._pool.query(query);
        if (!result.rows.length) {
            throw new NotFoundError("Transaksi gagal dihapus. Id tidak ditemukan");
        }
    }
}

module.exports = TransaksiService;
