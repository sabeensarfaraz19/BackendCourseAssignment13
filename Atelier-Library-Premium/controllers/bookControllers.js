const bookModel = require("../models/bookModels");

function getAllBooks(req, res) {
  const books = bookModel.getAllBooks();
  res
    .status(200)
    .json({ success: true, message: "Books Returned", data: books });
}

function getBookById(req, res) {
  let id = req.params.id;
  const book = bookModel.getBookById(id);
  if (!book) {
    return res.status(404).json({ success: false, message: "Book not Found" });
  }
  res.status(200).json({ success: true, message: "Book Returned", data: book });
}

function createBook(req, res) {
  let book = req.body;
  const createdBook = bookModel.createBook(book);
  res
    .status(201)
    .json({ success: true, message: "Book Created", data: createdBook });
}

function updatedBook(req, res) {
  let id = req.params.id;
  const { id: ignoredId, ...updatedBook } = req.body;
  const updateBook = bookModel.updateBook(id, updatedBook);
  if (!updateBook) {
    return res.status(404).json({ success: false, message: "Book not Found" });
  }
  res
    .status(200)
    .json({ success: true, message: "Book Updated", data: updateBook });
}

function patchBook(req, res) {
  let id = req.params.id;
  const { id: ignoredId, ...updates } = req.body;
  const patchBook = bookModel.patchBook(id, updates);

  if (!patchBook) {
    return res.status(404).json({ success: false, message: "Book not Found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Book Updated", data: patchBook });
}

function deleteBook(req, res) {
  let id = req.params.id;
  const deleteBook = bookModel.deleteBook(id);

  if (!deleteBook) {
    return res.status(404).json({ success: false, message: "Book not Found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Book Deleted", data: deleteBook });
}

function searchBooks(req, res) {
  let title = req.query.title;

  if (!title || title.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Title query is required" });
  }

  const searchBooks = bookModel.searchBooks(title.trim());
  res
    .status(200)
    .json({ success: true, message: "Books Returned", data: searchBooks });
}

function availableBooks(req, res) {
  const availableBooks = bookModel.availableBooks();
  res
    .status(200)
    .json({ success: true, message: "Books Returned", data: availableBooks });
}

function filterByCategory(req, res) {
  let category = req.params.category;
  const filterByCategory = bookModel.filterByCategory(category);
  res
    .status(200)
    .json({ success: true, message: "Books Returned", data: filterByCategory });
}

function filterByAuthor(req, res) {
  let author = req.params.author;
  const filterByAuthor = bookModel.filterByAuthor(author);
  res
    .status(200)
    .json({ success: true, message: "Books Returned", data: filterByAuthor });
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updatedBook,
  patchBook,
  deleteBook,
  searchBooks,
  availableBooks,
  filterByCategory,
  filterByAuthor,
};
