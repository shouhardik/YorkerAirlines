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

## Jenkins CI

This repo now includes a `Jenkinsfile` with stages:

- Checkout
- Install (`npm ci`)
- Test (`npm test`)
- Build (`npm run build`)
- Docker Build & Push
- Deploy to Kubernetes

### Notes

- The pipeline expects Jenkins NodeJS tool named `node-20`.
- If your Jenkins tool has a different name, update it in `Jenkinsfile` under `tools`.
- Docker credentials ID expected by pipeline: `dockerhub-creds`
- Kubernetes credentials ID expected by pipeline: `kubeconfig` (Secret file type)

### Deployment Files Added

- Docker build file: `backend/Dockerfile`
- Kubernetes manifests:
  - `k8s/deployment.yaml`
  - `k8s/service.yaml`
  - `k8s/ingress.yaml`
