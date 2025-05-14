const routes = (handler) => [
    {
        method: "POST",
        path: "/menu",
        handler: handler.postMenuHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
    {
        method: "GET",
        path: "/menu",
        handler: handler.getMenuHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
    {
        method: "PUT",
        path: "/menu/{id_menu}",
        handler: handler.putMenuByIdHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
    {
        method: "DELETE",
        path: "/menu/{id_menu}",
        handler: handler.deleteMenuByIdHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
];

module.exports = routes;
