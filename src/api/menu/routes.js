const routes = (handler) => [
    {
        method: "POST",
        path: "/menu",
        handler: handler.postMenuHandler,
    },
    {
        method: "GET",
        path: "/menu",
        handler: handler.getMenuHandler,
    },
    {
        method: "PUT",
        path: "/menu/{id_menu}",
        handler: handler.putMenuByIdHandler,
    },
    {
        method: "DELETE",
        path: "/menu/{id_menu}",
        handler: handler.deleteMenuByIdHandler,
    },
];

module.exports = routes;
