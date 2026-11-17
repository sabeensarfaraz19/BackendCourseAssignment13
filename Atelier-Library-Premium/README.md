# Atelier Library — Library Management

A responsive library dashboard connected to the supplied Express MVC API.

## Run locally
1. Install Node.js 18 or newer.
2. Open this project folder in VS Code / terminal.
3. Run `npm install`.
4. Run `npm start`.
5. Open http://localhost:3000.

## Features
- View the full book catalogue and live collection statistics
- Search by title; filter by category and availability
- Sort by title or publication year
- Add, view, edit, and delete books
- Responsive desktop and mobile layout

## API
The frontend uses the existing `/api/books` endpoints:
- GET `/api/books`
- GET `/api/books/:id`
- POST `/api/books`
- PUT `/api/books/:id`
- PATCH `/api/books/:id` (available through API clients)
- DELETE `/api/books/:id`
- GET `/api/books/search?title=...`
- GET `/api/books/available`
- GET `/api/books/category/:category`
- GET `/api/books/author/:author`

## Backend notes
The original routes referenced validation middleware that was not implemented. The missing `validateId`, `validateBook`, and `validateBookUpdates` middleware functions were added so the supplied routes can run and validate requests as described in the original README. The book model, controller logic, route paths, seed data, and in-memory storage behavior are otherwise preserved.

Book records are stored in memory and reset whenever the server restarts.
