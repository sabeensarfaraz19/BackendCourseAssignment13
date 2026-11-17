# Employee Task Management

The frontend and Express API are integrated and served from the same origin.

## Run locally
1. Install Node.js (18 or newer).
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open http://localhost:3000

The API base URL is `/api/tasks`.

Available endpoints:
- `GET /api/tasks`
- `GET /api/tasks/summary`
- `GET /api/tasks/overdue`
- `GET /api/tasks/employee/:name`
- `GET /api/tasks/status/:status`
- `GET /api/tasks/priority/:priority`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

Note: task data is currently held in memory, matching the supplied backend. Changes reset when the server restarts.
