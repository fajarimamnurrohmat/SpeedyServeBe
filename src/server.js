require("dotenv").config();
const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Inert = require('@hapi/inert');

//kategori
const categories = require("./api/categories");
const CategoriesService = require("./services/postgres/CategoriesService");
const CategoriesValidator = require("./validator/categories");

//users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

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

//authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const AuthenticationsValidator = require("./validator/authentications");
const TokenManager = require("./tokenize/TokenManager");
//const { verify } = require("jsonwebtoken");

const init = async () => {
  const authenticationsService = new AuthenticationsService();
  const usersService = new UsersService();
  const categoriesServices = new CategoriesService();
  const menuService = new MenuService();
  const orderService = new OrderService();
  const transaksiService = new TransaksiService();

  const server = Hapi.server({
    port: process.env.PORT || 3000, // Gunakan PORT dari environment atau fallback ke 3000
    host: "0.0.0.0", // Gunakan 0.0.0.0 untuk production di Railway
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });
  //registrasi plugin eksternal
  await server.register([
    {
      plugin: Inert, // Register the plugin
    },
    {
      plugin: Jwt,
    },
  ]);

  //strategy authentikasi Jwt
  server.auth.strategy("speedyserve_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        level: artifacts.decoded.payload.level,
      },
    }),
  });
  await server.register([
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
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
