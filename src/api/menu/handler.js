class MenuHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMenuHandler = this.postMenuHandler.bind(this);
    this.getMenuHandler = this.getMenuHandler.bind(this);
    this.getAvailableMenuHandler = this.getAvailableMenuHandler.bind(this);
    this.putMenuByIdHandler = this.putMenuByIdHandler.bind(this);
    this.deleteMenuByIdHandler = this.deleteMenuByIdHandler.bind(this);
    this.putMenuAvailabilityHandler = this.putMenuAvailabilityHandler.bind(this);
  }

  async postMenuHandler(request, h) {
    try {
      const { level } = request.auth.credentials;
      if (level < 3) {
        return h
          .response({
            status: "fail",
            message: "Anda tidak memiliki izin untuk mengedit menu",
          })
          .code(403);
      }

      this._validator.validateMenuPayload(request.payload);
      const { id_category, nama_menu, harga_menu, tersedia } = request.payload;

      const menuId = await this._service.addMenu({
        id_category,
        nama_menu,
        harga_menu,
        tersedia,
      });

      const response = h.response({
        status: "success",
        message: "Menu berhasil ditambahkan",
        data: { menuId },
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

  async getMenuHandler() {
    const menu = await this._service.getMenu();
    return {
      status: "success",
      data: { menu },
    };
  }

  async getAvailableMenuHandler(){
    const menu = await this._service.getAvailableMenu();
    return {
      status: "success",
      data: { menu },
    };
  }

  async putMenuAvailabilityHandler(request, h) {
    try {
    const { level } = request.auth.credentials;
    if (level < 1) {
      return h
        .response({
          status: 'fail',
          message: 'Anda tidak memiliki izin untuk mengubah status ketersediaan menu',
        })
        .code(403);
    }

    const { id_menu } = request.params;
    const { tersedia } = request.payload;

    // Validasi sederhana (opsional, tergantung validator kamu)
    if (typeof tersedia !== 'boolean') {
      return h
        .response({
          status: 'fail',
          message: 'Nilai "tersedia" harus berupa boolean',
        })
        .code(400);
    }

    await this._service.updateMenuAvailability(id_menu, tersedia);

    return {
      status: 'success',
      message: 'Status ketersediaan menu berhasil diperbarui',
    };
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message,
    });
    response.code(404);
    return response;
  }
  }

  async putMenuByIdHandler(request, h) {
    try {
      const { level } = request.auth.credentials;
      if (level < 3) {
        return h
          .response({
            status: "fail",
            message: "Anda tidak memiliki izin untuk mengedit menu",
          })
          .code(403);
      }

      this._validator.validateMenuPayload(request.payload);
      const { id_category, nama_menu, harga_menu, tersedia } = request.payload;
      const { id_menu } = request.params;

      await this._service.editMenuById(id_menu, {
        id_category,
        nama_menu,
        harga_menu,
        tersedia,
      });

      return {
        status: "success",
        message: "Menu berhasil diperbarui",
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  async deleteMenuByIdHandler(request, h) {
    try {
      const { level } = request.auth.credentials;
      if (level < 3) {
        return h
          .response({
            status: "fail",
            message: "Anda tidak memiliki izin untuk mengedit menu",
          })
          .code(403);
      }

      const { id_menu } = request.params;
      await this._service.deleteMenuById(id_menu);

      return {
        status: "success",
        message: "Menu berhasil dihapus",
      };
    } catch (error) {
      const response = h.response({
        status: "fail",
        message: "Menu gagal dihapus. Id tidak ditemukan",
      });
      response.code(404);
      return response;
    }
  }
}

module.exports = MenuHandler;
