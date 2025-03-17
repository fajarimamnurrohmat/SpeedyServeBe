const routes = (handler) => [
  {
    method: "POST",
    path: "/order",
    handler: handler.postOrderHandler,
  },
  {
    method: "GET",
    path: "/order",
    handler: handler.getOrdersHandler,
  },
  {
    method: "GET",
    path: "/order/{id}",
    handler: handler.getOrderByIdHandler,
  },
  {
    method: "PUT",
    path: "/status_order/{id_order}",
    handler: handler.putOrderStatusHandler,
  },
  {
    method: "DELETE",
    path: "/order/{id}",
    handler: handler.deleteOrderHandler,
  },
];

module.exports = routes;
