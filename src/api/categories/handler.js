class CategoryHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postCategoryHandler = this.postCategoryHandler.bind(this);
        this.getCategoryHandler = this.getCategoryHandler.bind(this);
        this.putCategoryByIdHandler = this.putCategoryByIdHandler.bind(this);
        this.deleteCategoryByIdHandler = this.deleteCategoryByIdHandler.bind(this);
    }
    async postCategoryHandler(request, h) {
        try {
            this._validator.validateCategoryPayload(request.payload);
            const { nama_category } = request.payload;
            const categoryId = await this._service.addCategory({ nama_category });
            const response = h.response({
                status: "success",
                message: "Category berhasil ditambahkan",
                data: {
                    categoryId,
                },
            });
            response.code(201);
            return response;
        } 
        catch (error) {
            const response = h.response({
                status: "fail",
                message: error.message,
            });
            response.code(400);
            return response;
        }
    }
    async getCategoryHandler() {
        const category = await this._service.getCategory();
        return {
            status: "success",
            data: {
                category,
            },
        };
    }
    async putCategoryByIdHandler(request, h) {
        try {
            this._validator.validateCategoryPayload(request.payload);
            const { nama_category } = request.payload;
            const { id } = request.params;
            await this._service.editCategoryById(id, { nama_category });
            return {
                status: "success",
                message: "Category berhasil diperbarui",
            };
        } 
        catch (error) {
            const response = h.response({
                status: "fail",
                message: error.message,
            });
            response.code(404);
            return response;
        }
    }
    async deleteCategoryByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteCategoryById(id);
            return {
                status: "success",
                message: "Category berhasil dihapus",
            };
        } 
        catch (error) {
            const response = h.response({
                status: "fail",
                message: "Category gagal dihapus. Id tidak ditemukan",
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = CategoryHandler;