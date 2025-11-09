HackUTD 2025
Kynetic Car Dashboard
=====================

Modern car shopping dashboard with a React/Vite frontend and a Node.js/Express backend. It lets users:

- Browse and filter cars by body type, powertrain, region, year, and budget
- Compare models and view a concise heuristic summary
- Save favorites to “My Garage”, book test drives, and explore lease options
- Chat assistant powered entirely by local NLP heuristics (no external AI)

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS, Zustand, React Router, Lucide Icons
- Backend: Node.js, Express, CORS, dotenv, JSON storage utilities
- NLP: compromise (lightweight parsing for intents/entities)

## Project Structure

- `frontend/` React/Vite app
- `backend/` Express API (auth, cars, test drive, lease, heuristic compare, chat)

## Prerequisites

- Node.js 18+ (recommend latest LTS)
- npm 9+ or pnpm/yarn (commands below use npm)

## Environment

Backend reads `.env` from `backend/.env` for standard variables like `PORT` (optional).

- Default backend: `http://localhost:3000`
- Default frontend: `http://localhost:5173`

## Install & Run

Backend (API)

```bash
cd /Users/kushalc/Desktop/UTD/HackUTD/hackutd-2025/backend
npm install
npm run dev
```

You should see: “API running at http://localhost:3000”

Frontend (Web)

```bash
cd /Users/kushalc/Desktop/UTD/HackUTD/hackutd-2025/frontend
npm install
npm run dev
```

Open the printed URL (typically `http://localhost:5173`).

## Key Endpoints

- `POST /api/compare-summary` – returns a concise, heuristic summary between two cars
- `POST /api/chat` – returns local heuristic responses for general queries
- `GET /api/cars` – protected; fetch cars list
- `POST /api/testdrive` – protected; book a test drive
- `POST /api/lease` – protected; lease workflow

## Notes

- No external AI services are used; all responses are local/heuristic.
- CORS is configured for frontend `http://localhost:5173`.
- Demo images are under `frontend/public/images/`.
