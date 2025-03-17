const routes = (handler) => [
    {
        method: "POST",
        path: "/transaksi",
        handler: handler.postTransactionHandler,
    },
    {
        method: "GET",
        path: "/transaksi",
        handler: handler.getTransactionsHandler,
    },
    {
        method: "GET",
        path: "/transaksi/{id_transaksi}",
        handler: handler.getTransactionByIdHandler,
    },
    {
        method: "DELETE",
        path: "/transaksi/{id_transaksi}",
        handler: handler.deleteTransactionHandler,
    },
];

module.exports = routes;
