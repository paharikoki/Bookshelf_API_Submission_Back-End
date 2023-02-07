const books = require('./books');
const {nanoid} = require("nanoid");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16)
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    if (name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage>pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const newBook = { id,name, year, author, summary, publisher, pageCount, readPage,  reading, finished, insertedAt, updatedAt };
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
                bookName: name
            },
        });
        response.code(201);
        return response;
    }
}

const getAllBooksHandler = (request, h) => {
    let {name, reading, finished} = request.query;
    if (name !== undefined){
        if (name === ''){
            const response = h.response({
                status: 'fail',
                message: 'Gagal memuat buku. Mohon isi nama buku',
            });
            response.code(404);
            return response;
        }
        const filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        if (filteredBooks.length === 0){
            const response = h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan',
            });
            response.code(404);
            return response;
        }else {
            const response = h.response({
                status: 'success',
                data: {
                    books: filteredBooks.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            });
            response.code(200);
            return response;
        }
    }
    if (reading !== undefined) {
        if (reading === '0') {
            reading = false;
            const filteredBooks = books.filter((book) => book.reading === reading);
            const response = h.response({
                status: 'success',
                data: {
                    books: filteredBooks.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            });
            response.code(200);
            return response;
        }
        else if(reading === '1')
        {
            reading = true;
            const filteredBooks = books.filter((book) => book.reading === reading);
            const response = h.response({
                status: 'success',
                data: {
                    books: filteredBooks.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            });
            response.code(200);
            return response;
        }else {
            const response = h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan',
            });
            response.code(200);
            return response;
        }
    }
    if (finished !== undefined){
        if (finished === '0') {
            finished = false;
            const filteredBooks = books.filter((book) => book.finished === finished);
            const response = h.response({
                status: 'success',
                data: {
                    books: filteredBooks.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            });
            response.code(200);
            return response;
        }else if (finished === '1'){
            finished = true;
            const filteredBooks = books.filter((book) => book.finished === finished);
            const response = h.response({
                status: 'success',
                data: {
                    books: filteredBooks.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            });
            response.code(200);
            return response;
        }else {
            const response = h.response({
                status: 'fail',
                message: 'Buku tidak ditemukan',
            });
            response.code(200);
            return response;
        }
    }
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
}

const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter((n) => n.id === bookId)[0];
    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
}

const editBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    if (name === undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage>pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        const book = books[index];
        book.name = name;
        book.year = year;
        book.author = author;
        book.summary = summary;
        book.publisher = publisher;
        book.pageCount = pageCount;
        book.readPage = readPage;
        book.reading = reading;
        book.updatedAt = updatedAt;
        book.finished = finished;
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
}

const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    }
}

const notFoundHandler = (request, h) => {
    const response = h.response({
        status: 'fail',
        message: 'Halaman tidak ditemukan',
    });
    response.code(404);
    return response;
}

module.exports = {addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler, notFoundHandler};