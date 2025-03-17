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

// menu
const menu = require("./api/menu");
const MenuService = require("./services/postgres/MenuService");
const MenuValidator = require("./validator/menu");

// orders
const order = require("./api/order");
const OrderService = require("./services/postgres/OrderService");
const OrderValidator = require("./validator/order");

// transaksi
const transaksi = require("./api/transaksi");
const TransaksiService = require("./services/postgres/TransaksiService");
const TransaksiValidator = require("./validator/transaksi");

const init = async () => {
    const usersService = new UsersService();
    const categoriesServices = new CategoriesService();
    const menuService = new MenuService();
    const orderService = new OrderService();
    const transaksiService = new TransaksiService();

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
        {
            plugin: menu,
            options: {
                service: menuService,
                validator: MenuValidator,
            },
        },
        {
            plugin: order,
            options: {
                service: orderService,
                validator: OrderValidator,
            },
        },        
        {
            plugin: transaksi,
            options: {
                service: transaksiService,
                validator: TransaksiValidator,
            },
        },
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};
init(); 