const TransactionHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: "transaksi",
    version: "1.0.0",
    register: async (server, { service, validator }) => {
        const transactionHandler = new TransactionHandler(service, validator);
        server.route(routes(transactionHandler));
    },
};
