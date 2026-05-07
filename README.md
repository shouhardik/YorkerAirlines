# Yorker Airlines - Full Stack Starter

This project includes a frontend and backend for a simple airline booking experience.

## Tech Stack

- Frontend: React + Vite
- Backend: Express
- Monorepo scripts: npm workspaces + concurrently

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start frontend and backend together:

```bash
npm run dev
```

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:4000`

## API Endpoints

- `GET /api/health`
- `GET /api/flights`
- `GET /api/bookings`
- `POST /api/bookings`

## CI/CD (GitHub Actions)

Two workflows are included:

- CI: `.github/workflows/ci.yml`
  - Runs on pull requests and pushes to `main`/`master`
  - Installs dependencies and runs `npm run build`

- CD: `.github/workflows/cd.yml`
  - Runs on push to `main`/`master` and manual trigger
  - Builds the app, uploads `frontend/dist` as an artifact
  - Optionally triggers deployment if repo secret `DEPLOY_HOOK_URL` is set

### Enable Deployment

1. In GitHub repo settings, create secret: `DEPLOY_HOOK_URL`
2. Set it to your platform deploy webhook URL (for example Render, Netlify, Vercel, etc.)
