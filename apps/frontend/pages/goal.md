Goal:
Generate a complete, ready-to-run monorepo (single repository) for a monolithic web application that uses:
- Frontend: Next.js (TypeScript)
- Backend: NestJS (TypeScript)
- Database: MySQL 8 (accessed via Prisma ORM)
- Architecture: Separate frontend and backend services (Option 1) — Next.js on port 3000, NestJS on port 5000.
- Dev environment: local dev scripts.
- Auth: Basic JWT authentication implemented in NestJS; NestJS issues a secure HttpOnly cookie on login and verifies it for protected endpoints. Frontend authenticates by calling NestJS endpoints.
- Language/versions: Node 18+, TypeScript.

Deliverables:
1. A clear top-level **folder tree** of the repo.
2. All important source files as code blocks with the file path above each block. Include at least:
   - Root: package.json (workspace scripts if using a monorepo tool), tsconfig.json (root), .gitignore, docker-compose.yml, README.md.
   - apps/frontend/: full Next.js app (TypeScript) with:
     - package.json, tsconfig.json
     - pages/ (or app/ if using Next 14 app router) containing:
       - index page that fetches a public endpoint from the backend and displays results
       - /dashboard page that calls a protected API endpoint (shows login flow)
       - /login page with a simple form that calls backend /auth/login
     - Example API fetch using `fetch('http://localhost:5000/api/...')` or using environment variable NEXT_PUBLIC_API_URL.
     - A simple global CSS or Tailwind setup (can be minimal).
   - apps/backend/: NestJS app (TypeScript) with:
     - package.json, tsconfig.json
     - src/main.ts configured to listen on port 5000
     - src/app.module.ts
     - src/auth/: auth module with controller, service, jwt strategy, guard, DTOs
     - src/users/: simple user module (User entity in Prisma)
     - src/example/: controller exposing a public GET `/api/public` and a protected GET `/api/protected` that requires authentication
     - Prisma client integration (prisma module/service) to access MySQL
     - Validation pipes and global exception filter basic setup
   - prisma/: schema.prisma file configured for MySQL, with a minimal User model (id, email, passwordHash, createdAt)
   - docker-compose.yml to run  mysql:8, backend/frontend locally (not containerized required, but compose must include DB).
   - Dockerfiles for frontend and backend (optional but preferred).
   - .env.example files for root or each app with keys such as DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_API_URL, etc.
   - GitHub Actions workflow file that runs tests (if provided) and outlines build steps for frontend and backend.

3. A minimal set of instructions (README.md) explaining:
   - How to install dependencies (npm/pnpm/workspace)
   - How to run Prisma migrations and start the MySQL container
   - How to start frontend and backend in dev mode
   - Example requests: register a user, login (and inspect cookie), access protected endpoint from Next.js
   - How to run the app in Docker (if you provide Dockerfiles for services) or how to run locally with docker-compose for DB only.

4. Example data:
   - prisma/seed script or SQL seed that creates one user with email `alice@example.com` and password `Password123!` (hashed using bcrypt in the seed or with a migration script).
   - Example API responses for public and protected endpoints.

5. Quality & constraints:
   - Use TypeScript everywhere.
   - Keep code clear and commented where necessary.
   - Use best practices for environment variables, secrets (do not hardcode secrets).
   - Do not use any external managed auth service — implement local JWT logic inside NestJS.
   - Keep the project minimal but functional — no heavy UI or many pages; main goal is correct wiring between Next.js, NestJS, and MySQL.
   - Make sure Next.js fetch calls the backend at `http://localhost:5000` in development (or via NEXT_PUBLIC_API_URL env variable).
   - Provide minimal ESLint/prettier or at least recommend them in README.

6. Output format:
   - Provide the **folder tree** first.
   - Then present each file as a code block prefixed with its path, in a logical order (root files, prisma, apps/backend, apps/frontend).
   - After the files, add a step-by-step **"Quick start"** section that includes the exact commands to run (copyable).
   - Add an explanation of how login works (which cookies are set, how to call protected endpoints from the browser / Next.js).
   - If something must be run manually (e.g., `npx prisma migrate dev`), show the exact commands.

Acceptance criteria (what I will check after generation):
- I can run `npm install` then `npx prisma migrate dev --name init` to apply schema.
- I can start backend `npm run start:dev` in apps/backend and it listens on port 5000.
- I can start frontend `npm run dev` in apps/frontend and it listens on port 3000.
- Visiting `http://localhost:3000` loads Next.js and the index fetches from backend `http://localhost:5000/api/public`.
- I can POST to `http://localhost:5000/api/auth/register` to create the seed user, then POST to `/api/auth/login` to receive an HttpOnly cookie, and then call `/api/protected` which returns data only when cookie is present.

Optional extras (nice to have):
- Nx or Turborepo setup for tasks/scripts (only if simple to include)
- Prisma Studio instructions
- A GitHub Actions skeleton for building both apps and pushing Docker images

Please produce only the project files and supporting documentation as requested. Name the project `monorepo-next-nest-mysql` in the README examples and envs. Keep answers crisp and include comments in the code where helpful.
