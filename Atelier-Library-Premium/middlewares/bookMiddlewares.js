function validateId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid Book ID",
    });
  }

  next();
}

function validateBook(req, res, next) {
  const { title, author, category, publishedYear, available } = req.body || {};
  const errors = [];
  const currentYear = new Date().getFullYear();

  if (typeof title !== "string" || !title.trim()) errors.push("title is required");
  if (typeof author !== "string" || !author.trim()) errors.push("author is required");
  if (typeof category !== "string" || !category.trim()) errors.push("category is required");
  if (!Number.isInteger(publishedYear) || publishedYear < 1000 || publishedYear > currentYear) {
    errors.push("publishedYear must be a whole number between 1000 and the current year");
  }
  if (typeof available !== "boolean") errors.push("available must be true or false");

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors,
    });
  }

  req.body = {
    title: title.trim(),
    author: author.trim(),
    category: category.trim(),
    publishedYear,
    available,
  };
  next();
}

function validateBookUpdates(req, res, next) {
  const updates = req.body || {};
  const allowed = ["title", "author", "category", "publishedYear", "available"];
  const keys = Object.keys(updates);
  const errors = [];
  const currentYear = new Date().getFullYear();

  if (keys.length === 0) errors.push("At least one field is required");
  for (const key of keys) {
    if (!allowed.includes(key)) errors.push(`${key} is not an allowed field`);
  }
  if ("title" in updates && (typeof updates.title !== "string" || !updates.title.trim())) {
    errors.push("title must be a non-empty string");
  }
  if ("author" in updates && (typeof updates.author !== "string" || !updates.author.trim())) {
    errors.push("author must be a non-empty string");
  }
  if ("category" in updates && (typeof updates.category !== "string" || !updates.category.trim())) {
    errors.push("category must be a non-empty string");
  }
  if ("publishedYear" in updates && (!Number.isInteger(updates.publishedYear) || updates.publishedYear < 1000 || updates.publishedYear > currentYear)) {
    errors.push("publishedYear must be a whole number between 1000 and the current year");
  }
  if ("available" in updates && typeof updates.available !== "boolean") {
    errors.push("available must be true or false");
  }

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors,
    });
  }

  for (const key of ["title", "author", "category"]) {
    if (typeof updates[key] === "string") updates[key] = updates[key].trim();
  }
  next();
}

module.exports = { validateId, validateBook, validateBookUpdates };
