const routes = (handler) => [
    {
        method: "POST",
        path: "/transaksi",
        handler: handler.postTransactionHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
    {
        method: "GET",
        path: "/transaksi",
        handler: handler.getTransactionsHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
    {
        method: "GET",
        path: "/transaksi/{id_transaksi}",
        handler: handler.getTransactionByIdHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
    {
        method: "DELETE",
        path: "/transaksi/{id_transaksi}",
        handler: handler.deleteTransactionHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
];

module.exports = routes;
