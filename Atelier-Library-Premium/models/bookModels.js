const books = require("../data/bookData");

function getAllBooks() {
  return books;
}

function getBookById(id) {
  let returnedBook = books.find((book) => {
    return book.id === Number(id);
  });

  return returnedBook;
}

function createBook(book) {
  const newId =
    books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1;

  let newBook = { id: newId, ...book };
  books.push(newBook);

  return newBook;
}

function updateBook(id, updatedBook) {
  let searchedBook = books.find((book) => {
    return book.id === Number(id);
  });

  if (!searchedBook) {
    return null;
  }

  let index = books.indexOf(searchedBook);
  books[index] = { id: searchedBook.id, ...updatedBook };

  return books[index];
}

function patchBook(id, updates) {
  let searchedBook = books.find((book) => {
    return book.id === Number(id);
  });

  if (!searchedBook) {
    return null;
  }

  return Object.assign(searchedBook, updates);
}

function deleteBook(id) {
  let searchedBook = books.find((book) => {
    return book.id === Number(id);
  });

  if (!searchedBook) {
    return null;
  }

  let index = books.indexOf(searchedBook);

  return books.splice(index, 1)[0];
}

function searchBooks(title) {
  let filteredBooks = books.filter((book) => {
    return book.title.toLowerCase().includes(title.toLowerCase());
  });

  return filteredBooks;
}

function availableBooks() {
  let filteredBooks = books.filter((book) => {
    return book.available === true;
  });

  return filteredBooks;
}

function filterByCategory(category) {
  let filteredBooks = books.filter((book) => {
    return book.category.toLowerCase() === category.toLowerCase();
  });

  return filteredBooks;
}

function filterByAuthor(author) {
  let filteredBooks = books.filter((book) => {
    return book.author.toLowerCase().includes(author.toLowerCase());
  });

  return filteredBooks;
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  patchBook,
  deleteBook,
  searchBooks,
  availableBooks,
  filterByCategory,
  filterByAuthor,
};
