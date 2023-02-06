const {addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
    notFoundHandler,

} = require('./booksHandler');

const routes = [
    {
        path: '/',
        method: 'GET',
        handler: () => {
            return 'Hello World!';
        }
    },
    {
        path: '/books',
        method: 'POST',
        handler: addBookHandler,
    },
    {
        path: '/books',
        method: 'GET',
        handler: getAllBooksHandler,
    },
    {
        path: '/books/{bookId}',
        method: 'GET',
        handler: getBookByIdHandler,
    },
    {
        path: '/books/{bookId}',
        method: 'PUT',
        handler: editBookByIdHandler,
    },
    {
        path: '/books/{bookId}',
        method: 'DELETE',
        handler: deleteBookByIdHandler,
    },
    {
        //route for 404
        method: '*',
        path: '/{any*}',
        handler: notFoundHandler,
    }
    ];

module.exports = routes;