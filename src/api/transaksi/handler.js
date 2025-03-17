const { nanoid } = require("nanoid");

class TransactionHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postTransactionHandler = this.postTransactionHandler.bind(this);
    this.getTransactionsHandler = this.getTransactionsHandler.bind(this);
    this.getTransactionByIdHandler = this.getTransactionByIdHandler.bind(this);
    this.deleteTransactionHandler = this.deleteTransactionHandler.bind(this);
  }

  // 📝 Menambahkan transaksi (POST /transaction)
  async postTransactionHandler(request, h) {
    try {
      this._validator.validateTransactionPayload(request.payload);
      const id_transaksi = `TRX-${nanoid(16)}`;
      const { id_order } = request.payload;
      
      await this._service.addTransaksi({ id_transaksi, id_order });

      const response = h.response({
        status: "success",
        message: "Transaksi berhasil ditambahkan",
        data: { id_transaksi },
      });
      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(400);
      return response;
    }
  }

  // 📜 Mendapatkan semua transaksi (GET /transaction)
  async getTransactionsHandler() {
    const transactions = await this._service.getTransaksi();
    return {
      status: "success",
      data: { transactions },
    };
  }

  // 🔍 Mendapatkan transaksi berdasarkan ID (GET /transaction/{id})
  async getTransactionByIdHandler(request, h) {
    try {
      const { id_transaksi } = request.params;
      const transaction = await this._service.getTransaksiById(id_transaksi);
      return {
        status: "success",
        data: { transaction },
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: "Transaksi tidak ditemukan",
      });
      response.code(404);
      return response;
    }
  }

  // ❌ Menghapus transaksi (DELETE /transaction/{id})
  async deleteTransactionHandler(request, h) {
    try {
      const { id_transaksi } = request.params;
      await this._service.deleteTransaksiById(id_transaksi);

      return {
        status: "success",
        message: "Transaksi berhasil dihapus",
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: "Transaksi gagal dihapus. ID tidak ditemukan",
      });
      response.code(404);
      return response;
    }
  }
}

module.exports = TransactionHandler;
