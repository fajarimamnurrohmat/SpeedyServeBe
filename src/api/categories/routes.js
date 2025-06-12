const routes = (handler) => [
    {
        method: "POST",
        path: "/category",
        handler: handler.postCategoryHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
    {
        method: "GET",
        path: "/category",
        handler: handler.getCategoryHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
    {
        method: "PUT",
        path: "/category/{id_category}",
        handler: handler.putCategoryByIdHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
    {
        method: "DELETE",
        path: "/category/{id}",
        handler: handler.deleteCategoryByIdHandler,
        options: {
            auth: 'speedyserve_jwt',
        },
    },
    {
    method: 'GET',
    path: '/category/hello',
    handler: handler.sayHelloHandler,
}
];
module.exports = routes;
