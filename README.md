# PUNA JOTE

PUNA JOTE is a web-first platform that connects job and service requests with trusted providers in Kosovo, designed to scale globally.

## Monorepo Layout
- frontend: Next.js (App Router) web app
- backend: NestJS REST API with Socket.io
- shared: Shared TypeScript types

## Example REST Endpoints
Auth
- POST /api/auth/register
- POST /api/auth/login

Users
- GET /api/users/me
- PATCH /api/users/me

Jobs
- GET /api/jobs
- POST /api/jobs
- GET /api/jobs/:id

Offers
- POST /api/offers
- PATCH /api/offers/:id/status

Messages
- GET /api/messages/threads
- GET /api/messages/threads/:id

Reviews
- POST /api/reviews
- GET /api/reviews/user/:id

Categories
- GET /api/categories

## Scalability and Security Notes
- Stateless JWT auth with short-lived access tokens and refresh flow ready to add.
- Prisma schema uses indexes for city, category, and status filtering.
- Modular NestJS structure supports independent scaling of features.
- Socket gateway isolates real-time chat logic.
- Input validation with DTOs and class-validator.
- Service boundaries with shared contracts in /shared.

## Development
- Frontend: npm run dev:frontend
- Backend: npm run dev:backend

## Local Database (Docker)
- Start Postgres: docker compose up -d
- Run migrations: npm --workspace backend run prisma:migrate

## Database
- Configure backend/.env with DATABASE_URL and JWT_SECRET.
- Run Prisma migrations from backend.
