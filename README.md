# monorepo-next-nest-mysql

A minimal monorepo with Next.js (frontend) and NestJS (backend) using MySQL and Prisma. Designed for local development: Next runs on :3000, Nest on :5000, MySQL via docker-compose.

Quick summary:

- Frontend: apps/frontend (Next.js, TypeScript)
- Backend: apps/backend (NestJS, TypeScript)
- DB: MySQL 8 (docker-compose)
- ORM: Prisma
- Auth: JWT issued as HttpOnly cookie from backend, verified on protected endpoints

Prereqs: Node 18+, npm, Docker & docker-compose

Quick start (development):

1. Start DB

```powershell
docker-compose up -d
```

2. Install dependencies (root uses npm workspaces)

```powershell
npm install
npx prisma generate --schema=prisma/schema.prisma
```

3. Apply migrations and seed (creates alice@example.com)

```powershell
npx prisma migrate dev --name init --schema=prisma/schema.prisma
npx ts-node --transpile-only prisma/seed.ts
```

4. Start backend

```powershell
cd apps/backend
npm run start:dev
# listens on http://localhost:5000
```

5. Start frontend

```powershell
cd apps/frontend
npm run dev
# listens on http://localhost:3000
```

6. Test

- Visit http://localhost:3000
- Login at /login with alice@example.com / Password123!
- Dashboard will call protected backend endpoint and show protected data.

Notes:

- Set environment variables in .env files. See .env.example files.
- Use `npx prisma studio --schema=prisma/schema.prisma` to inspect DB.

Security:

- Set a strong JWT_SECRET before deploying.
- Use HTTPS and set NODE_ENV=production to enable secure cookies.

CI:

- A basic GitHub Actions workflow exists at .github/workflows/ci.yml

License: MIT
