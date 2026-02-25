# Ocean Insight Backend

This directory contains a Node.js/Express backend written in TypeScript. It
runs independently from the frontend, which is served on a different port, and
communicates via HTTP APIs under `/api` (e.g. `http://localhost:4000/api/...`).

## Features

- TypeScript with strict typing and compiled build
- Express app with clean structure (routes/controllers/middleware/config)
- MongoDB integration via Mongoose (models stored in `src/models`)
- JWT authentication with bcrypt password hashing
- CORS configured for frontend origin from env (`FRONTEND_URL`)
- Centralized error handling and 404 responses
- Development and production npm scripts
- Example test route (`GET /api/test`)

## Configuration

Copy `.env.example` to `.env` and set values:

```env
PORT=4000              # backend port, default 4000
MONGO_URI=mongodb://localhost:27017/ocean_insight
JWT_SECRET=your_secret
FRONTEND_URL=http://localhost:5173  # allowed origin for CORS
```

## Available scripts

- `npm install` – install dependencies
- `npm run dev` – start in development mode (uses ts-node-dev/nodemon)
- `npm run build` – compile TypeScript to `dist` (no server start)
- `npm start` – run compiled code from `dist` (production)
- `npm run lint` – run eslint checks

## Running

```bash
cd backend
npm install
npm run dev          # dev server, auto-reloads
# or for production:
npm run build
npm start
```

The server binds to `0.0.0.0` and logs `Server running on port <PORT>`.

## Database

Uses MongoDB with Mongoose. Connection is handled in `src/config/db.ts` using
`MONGO_URI` from env. Models are defined under `src/models`.

## API Endpoints

- `GET /api/test` – sanity check, returns `{ message: 'Backend working successfully' }`
- `POST /api/auth/signup` – register a new user
- `POST /api/auth/login` – login to receive a JWT
- `GET /api/auth/protected` – example protected route, requires Bearer token

Responses are all JSON with consistent structure. Errors return appropriate HTTP
status codes and `{ success: false, error: '...' }` payloads.

## Integration with Frontend

The frontend runs on a different port (e.g. `http://localhost:5173`) and should
make requests to `http://localhost:4000/api/...`. No changes to the frontend are
required – CORS and API paths are already configured accordingly.
