# Blog REST API

A RESTful API for blog posts built with Express and TypeScript. It has full CRUD, request validation with Zod, modular routing with `express.Router()`, request logging, CORS and a global error handler. Posts are stored in memory.

## Features

- Five REST endpoints with correct status codes (`201`, `200`, `204`, `400`, `404`)
- Request validation with Zod, including partial updates
- Routes split into their own module and mounted at `/posts`
- `morgan` request logging, CORS, and a global error-handling middleware

## Tech stack

Node.js, Express 5, TypeScript, Zod, morgan, cors

## Getting started

Requires Node.js 18 or newer.

```bash
git clone https://github.com/YOUR-USERNAME/blog-rest-api.git
cd blog-rest-api
npm install
npm run dev
```

The API runs at `http://localhost:3000`.

## API

| Method | Endpoint | Description | Success |
|---|---|---|---|
| GET | `/posts` | List all posts | 200 |
| GET | `/posts/:id` | Get one post | 200 |
| POST | `/posts` | Create a post (`title`, `content`, `author`) | 201 |
| PATCH | `/posts/:id` | Update any subset of `title`, `content`, `author` | 200 |
| DELETE | `/posts/:id` | Delete a post | 204 |

**Create a post**

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"First post","author":"Omotayo"}'
```

```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "title": "Hello",
    "content": "First post",
    "author": "Omotayo",
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
}
```

**Update part of a post**

```bash
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello again"}'
```

Only `title` changes. `createdAt` is preserved and `updatedAt` is refreshed.

**Errors**

| Case | Response |
|---|---|
| Invalid or missing fields | `400` with `{ "message": "...", "error": [ ...Zod issues ] }` |
| Id does not exist | `404` |
| Unexpected server error | `500` with `{ "message": "There was a problem from our end" }` |

## Project structure

```
src/
  index.ts          app setup and middleware
  routes/
    posts.ts        the /posts router and its handlers
```

## Design decisions and edge cases

- **An array, not a `Map`.** Listing every post is the most common operation, and an array is already the shape `GET /posts` returns.
- **`PATCH`, not `PUT`.** Updates are partial, so the update schema is the create schema made optional with Zod's `.partial()`.
- **The server owns `id`, `createdAt` and `updatedAt`.** Clients cannot set them. Merging with the spread operator keeps untouched fields intact.
- **Ids are `max(existing ids) + 1`,** not the array length, so deleting a post from the middle can never cause a duplicate id.
- **One `findIndex` per request** tells a route both whether the post exists and where it lives.
- **Middleware order matters.** `cors`, `express.json()` and `morgan` run before the router, and the error handler is registered last. It declares four parameters because Express recognises error handlers by parameter count.
- **A hand-written logger came first,** then was compared against `morgan` and replaced by it.

## Testing

Tested in Postman: every endpoint, invalid bodies, missing ids, partial updates, deleting from the middle of a list, and a deliberately thrown error for the global handler.

<!-- Export your Postman collection to docs/postman_collection.json and link it here. -->

## Limitations and next steps

- Posts live in memory and reset on restart.
- There is no authentication or pagination.
- A non-numeric id currently returns `404`. `400` would describe it better.
- No automated tests yet.
- Next: move storage to PostgreSQL with Prisma and add JWT authentication.

## License

MIT
