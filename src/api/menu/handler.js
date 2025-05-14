class MenuHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postMenuHandler = this.postMenuHandler.bind(this);
    this.getMenuHandler = this.getMenuHandler.bind(this);
    this.putMenuByIdHandler = this.putMenuByIdHandler.bind(this);
    this.deleteMenuByIdHandler = this.deleteMenuByIdHandler.bind(this);
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
      const { id_category, nama_menu, harga_menu } = request.payload;
      const menuId = await this._service.addMenu({
        id_category,
        nama_menu,
        harga_menu,
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
      const { id_category, nama_menu, harga_menu } = request.payload;
      const { id_menu } = request.params;

      await this._service.editMenuById(id_menu, {
        id_category,
        nama_menu,
        harga_menu,
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
