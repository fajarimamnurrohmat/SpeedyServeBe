class UsersHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;
        this.postUserHandler = this.postUserHandler.bind(this);
        this.getUsersHandler = this.getUsersHandler.bind(this);
        //this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
        //this.putUserByIdHandler = this.putUserByIdHandler.bind(this);
        this.deleteUserByIdHandler = this.deleteUserByIdHandler.bind(this);
    }
    async postUserHandler(request, h) {
        try {
            this._validator.validateUserPayload(request.payload);
            const { username, password, level } = request.payload;
            const userId = await this._service.addUser({ username, password, level });
            const response = h.response({
                status: "success",
                message: "User berhasil ditambahkan",
                data: {
                    userId,
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
    async getUsersHandler() {
        const users = await this._service.getUsers();
        return {
            status: "success",
            data: {
                users,
            },
        };
    }
    // async getUserByIdHandler(request, h) {
    //     try {
    //         const { id } = request.params;
    //         const user = await this._service.getUserById(id);
    //         return {
    //             status: "success",
    //             data: {
    //                 user,
    //             },
    //         };
    //     } 
    //     catch (error) {
    //         const response = h.response({
    //             status: "fail",
    //             message: error.message,
    //         });
    //         response.code(404);
    //         return response;
    //     }
    // }
    // async putUserByIdHandler(request, h) {
    //     try {
    //         this._validator.validateUserPayload(request.payload);
    //         const { username, password, level } = request.payload;
    //         const { id } = request.params;
    //         await this._service.editUserById(id, { username, password, level });
    //         return {
    //             status: "success",
    //             message: "User berhasil diperbarui",
    //         };
    //     } 
    //     catch (error) {
    //         const response = h.response({
    //             status: "fail",
    //             message: error.message,
    //         });
    //         response.code(404);
    //         return response;
    //     }
    // }
    async deleteUserByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteUserById(id);
            return {
                status: "success",
                message: "User berhasil dihapus",
            };
        } 
        catch (error) {
            const response = h.response({
                status: "fail",
                message: "Catatan gagal dihapus. Id tidak ditemukan",
            });
            response.code(404);
            return response;
        }
    }
}

module.exports = UsersHandler;