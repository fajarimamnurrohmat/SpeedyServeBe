const routes = (handler) => [
  {
    method: "POST",
    path: "/order",
    handler: handler.postOrderHandler,
    options: {
      auth: 'speedyserve_jwt',
    },
  },
  {
    method: "GET",
    path: "/order",
    handler: handler.getOrdersHandler,
    options: {
      auth: 'speedyserve_jwt',
    },
  },
  {
    method: "GET",
    path: "/order/{id}",
    handler: handler.getOrderByIdHandler,
    options: {
      auth: 'speedyserve_jwt',
    },
  },
  {
    method: "PUT",
    path: "/status_order/{id_order}",
    handler: handler.putOrderStatusHandler,
    options: {
      auth: 'speedyserve_jwt',
    },
  },
  {
    method: "DELETE",
    path: "/order/{id}",
    handler: handler.deleteOrderHandler,
    options: {
      auth: 'speedyserve_jwt',
    },
  },
];

module.exports = routes;
