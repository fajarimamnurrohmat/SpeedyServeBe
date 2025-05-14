const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class OrderService {
  constructor() {
    this._pool = new Pool();
  }

  // ✅ Tambah Pesanan
  async addOrder({
    nama_pemesan,
    no_hp,
    opsi_pesanan,
    jumlah_bayar,
    keterangan,
    detail_pesanan,
  }) {
    const id_order = `ORD-${nanoid(10)}`;
    const status_order = "Dalam Antrian";

    // Hitung total harga pesanan
    let total_harga = 0;
    for (const item of detail_pesanan) {
      const harga = await this.getHargaMenu(item.id_menu);
      total_harga += harga * item.jumlah;
    }

    const kembalian = jumlah_bayar - total_harga;

    // Insert ke tabel order
    const orderQuery = {
      text: `INSERT INTO "order" (id_order, nama_pemesan, no_hp, opsi_pesanan, total_harga, jumlah_bayar, kembalian, keterangan, status_order) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING id_order, status_order`,
      values: [
        id_order,
        nama_pemesan,
        no_hp,
        opsi_pesanan,
        total_harga,
        jumlah_bayar,
        kembalian,
        keterangan,
        status_order,
      ],
    };

    const orderResult = await this._pool.query(orderQuery);
    if (!orderResult.rows.length) {
      throw new InvariantError("Gagal menambahkan pesanan");
    }

    // Insert detail pesanan
    for (const item of detail_pesanan) {
      const subtotal = item.jumlah * (await this.getHargaMenu(item.id_menu));
      const detailQuery = {
        text: `INSERT INTO detail_order (id_detail_order, id_order, id_menu, jumlah, subtotal) 
               VALUES ($1, $2, $3, $4, $5)`,
        values: [
          `DET-${nanoid(10)}`,
          id_order,
          item.id_menu,
          item.jumlah,
          subtotal,
        ],
      };
      await this._pool.query(detailQuery);
    }

    return {
      id_order: orderResult.rows[0].id_order,
      status_order: orderResult.rows[0].status_order,
    };
  }

  // ✅ Ambil Daftar Pesanan
  async getOrders() {
    const orderQuery = `
      SELECT id_order, nama_pemesan, no_hp, opsi_pesanan, total_harga, jumlah_bayar, kembalian, keterangan, status_order 
      FROM "order"
      WHERE status_order != 'Selesai'
      ORDER BY id_order DESC
    `;
    const orders = await this._pool.query(orderQuery);

    // Ambil detail pesanan untuk setiap order
    for (let order of orders.rows) {
      const detailQuery = {
        text: `SELECT d.id_detail_order, d.id_menu, m.nama_menu, d.jumlah, d.subtotal
               FROM detail_order d
               JOIN menu m ON d.id_menu = m.id_menu
               WHERE d.id_order = $1`,
        values: [order.id_order],
      };
      const detailResult = await this._pool.query(detailQuery);
      order.detail_pesanan = detailResult.rows;
    }

    return orders.rows;
  }

  // ✅ Ambil Pesanan Berdasarkan ID
  async getOrderById(id_order) {
    // Mengambil informasi order berdasarkan id
    const query = {
      text: 'SELECT * FROM "order" WHERE id_order = $1',
      values: [id_order],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Pesanan tidak ditemukan");
    }

    const order = result.rows[0];

    // Ambil detail pesanan untuk order yang ditemukan
    const detailQuery = {
      text: `SELECT d.id_detail_order, d.id_menu, m.nama_menu, d.jumlah, d.subtotal
           FROM detail_order d
           JOIN menu m ON d.id_menu = m.id_menu
           WHERE d.id_order = $1`,
      values: [order.id_order],
    };
    const detailResult = await this._pool.query(detailQuery);
    order.detail_pesanan = detailResult.rows; // Menyimpan detail pesanan ke dalam order

    return order; // Mengembalikan order dengan detail pesanan
  }

  // ✅ Update Status Pesanan
  async updateOrderStatus(id_order, status_order) {
    const query = {
      text: 'UPDATE "order" SET status_order = $1 WHERE id_order = $2 RETURNING id_order',
      values: [status_order, id_order],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal..!Pesanan tidak ditemukan");
    }
  }

  // ✅ Hapus Pesanan
  async deleteOrder(id_order) {
    const deleteDetailQuery = {
      text: "DELETE FROM detail_order WHERE id_order = $1",
      values: [id_order],
    };
    await this._pool.query(deleteDetailQuery);

    const deleteOrderQuery = {
      text: 'DELETE FROM "order" WHERE id_order = $1 RETURNING id_order',
      values: [id_order],
    };

    const result = await this._pool.query(deleteOrderQuery);
    if (!result.rows.length) {
      throw new NotFoundError("Pesanan tidak ditemukan");
    }
  }

  // ✅ Ambil Harga Menu
  async getHargaMenu(id_menu) {
    const query = {
      text: "SELECT harga_menu FROM menu WHERE id_menu = $1",
      values: [id_menu],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Menu tidak ditemukan");
    }
    return result.rows[0].harga_menu;
  }
}

module.exports = OrderService;
