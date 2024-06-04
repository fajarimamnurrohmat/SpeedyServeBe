require('dotenv').config();
const Hapi = require("@hapi/hapi");
//barang

//kategori
const categories = require("./api/categories");
const CategoriesService = require("./services/postgres/CategoriesService");
const CategoriesValidator = require("./validator/categories");

//users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users")

const init = async () => {
    const usersService = new UsersService();
    const categoriesServices = new CategoriesService();
    const server = Hapi.server({
        port: 3000,
        host: "localhost",
        routes: {
        cors: {
            origin: ["*"],
        },
        },
    });
    await server.register([
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: categories,
            options: {
                service: categoriesServices,
                validator: CategoriesValidator,
            },
        },
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
init();