# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains product planning documents only: `SPEC.md`, `PRD.md`, and `TECHNICAL_PLAN.md`. Treat them as the source of truth for scope, UX tone, and implementation direction.

When scaffolding begins, follow the structure proposed in `TECHNICAL_PLAN.md`:

```text
src/app        route groups and API handlers
src/components shared UI and feature modules
src/lib        auth, db, storage, validation, permissions
src/server     services, repositories, presenters
src/types      shared TypeScript types
src/styles     global styles and design tokens
prisma/        Prisma schema and migrations
```

Keep feature code aligned to product modules: `universe`, `planet`, `milky-way`, and `constellation`.

## Build, Test, and Development Commands

No build tooling is committed yet. Once the Next.js app is added, standardize around these commands:

- `npm install` installs project dependencies.
- `npm run dev` starts the local development server.
- `npm run build` creates the production build.
- `npm run lint` runs static analysis before review.
- `npm test` runs the automated test suite.
- `npx prisma migrate dev` applies local schema changes.

Document any deviations in `README.md` when tooling is introduced.

## Coding Style & Naming Conventions

Use TypeScript throughout. Prefer 2-space indentation, semicolons, and single-responsibility modules. Use `PascalCase` for React components, `camelCase` for variables and functions, and `kebab-case` for route segments. Name feature folders after domain areas, for example `src/components/planet/EventCard.tsx`.

Adopt ESLint and Prettier when the app is scaffolded, and run formatting before opening a PR.

## Testing Guidelines

Testing infrastructure is not present yet. Add unit and integration tests alongside implementation and keep names consistent with the source, such as `EventCard.test.tsx` or `relationship-service.test.ts`. Prioritize service-layer logic, permission checks, and critical relationship lifecycle flows.

## Commit & Pull Request Guidelines

There is no commit history yet, so establish Conventional Commits from the start, for example `feat: add relationship invite flow` or `fix: enforce frozen-space write guard`.

PRs should include:

- a short problem/solution summary
- linked issue or task reference
- screenshots for UI changes
- notes on schema, env, or migration updates
- confirmation that linting and tests were run, or a brief reason if not

## Configuration & Security

Never commit secrets, database URLs, or storage credentials. Keep environment variables in `.env.local`, validate required config early, and centralize auth and relationship permission checks in shared server modules.
