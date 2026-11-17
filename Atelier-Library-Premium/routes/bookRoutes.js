const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookControllers");
const { validateId, validateBook, validateBookUpdates } = require("../middlewares/bookMiddlewares");

router.get("/", bookController.getAllBooks);
router.get("/search", bookController.searchBooks);
router.get("/available", bookController.availableBooks);
router.get("/category/:category", bookController.filterByCategory);
router.get("/author/:author", bookController.filterByAuthor);
router.get("/:id", validateId, bookController.getBookById);
router.post("/", validateBook, bookController.createBook);
router.put("/:id", validateId, validateBook, bookController.updatedBook);
router.patch("/:id", validateId, validateBookUpdates, bookController.patchBook);
router.delete("/:id", validateId, bookController.deleteBook);

module.exports = router;
