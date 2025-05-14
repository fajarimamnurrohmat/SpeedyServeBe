class OrderHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postOrderHandler = this.postOrderHandler.bind(this);
    this.getOrdersHandler = this.getOrdersHandler.bind(this);
    this.getOrderByIdHandler = this.getOrderByIdHandler.bind(this);
    this.putOrderStatusHandler = this.putOrderStatusHandler.bind(this);
    this.deleteOrderHandler = this.deleteOrderHandler.bind(this);
  }

  // Helper function to check level
  _checkLevelKoki(level) {
    if (level !== 1) {
        throw new ClientError("Akses ditolak: Anda tidak memiliki hak akses", 403);
    }
  }

  // 🛒 Menambahkan pesanan (POST /order)
  async postOrderHandler(request, h) {
    try {
      const { level } = request.auth.credentials;
      if (level < 2) {
        return h
          .response({
            status: "fail",
            message: "Anda tidak memiliki izin untuk mengedit menu",
          })
          .code(403);
      }
      this._validator.validateOrderPayload(request.payload);
      const orderId = await this._service.addOrder(request.payload);

      const response = h.response({
        status: "success",
        message: "Pesanan berhasil ditambahkan",
        data: { orderId },
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

  // 📜 Mendapatkan semua pesanan (GET /order)
  async getOrdersHandler() {
    const orders = await this._service.getOrders();
    return {
      status: "success",
      data: { orders },
    };
  }

  // 🔍 Mendapatkan pesanan berdasarkan ID (GET /order/{id})
  async getOrderByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const order = await this._service.getOrderById(id);
      return {
        status: "success",
        data: { order },
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: "Pesanan tidak ditemukan",
      });
      response.code(404);
      return response;
    }
  }

  // 🔄 Mengubah status pesanan (PUT /order/{id}/status)
  async putOrderStatusHandler(request, h) {
    try {
      const { level } = request.auth.credentials; // Mendapatkan level dari token
      this._checkLevelKoki(level); // Mengecek apakah level 1
      this._validator.validateUpdateStatusOrder(request.payload);
      const { id_order } = request.params;
      const { status_order } = request.payload;
      
      await this._service.updateOrderStatus(id_order, status_order);

      return {
        status: "success",
        message: "Status pesanan berhasil diperbarui",
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(400);
      return response;
    }
  }

  // ❌ Menghapus pesanan (DELETE /order/{id})
  async deleteOrderHandler(request, h) {
    try {
      const { level } = request.auth.credentials;
      if (level < 2) {
        return h
          .response({
            status: "fail",
            message: "Anda tidak memiliki izin untuk mengedit menu",
          })
          .code(403);
      }
      const { id } = request.params;
      await this._service.deleteOrder(id);

      return {
        status: "success",
        message: "Pesanan berhasil dihapus",
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: "Pesanan gagal dihapus. ID tidak ditemukan",
      });
      response.code(404);
      return response;
    }
  }
}

module.exports = OrderHandler;
