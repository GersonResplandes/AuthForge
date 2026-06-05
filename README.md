# AuthForge

AuthForge is an educational identity platform for SaaS applications, built to demonstrate secure authentication, authorization, sessions, organizations, auditability, and OAuth/OIDC-inspired flows.

This project is educational. It is not a certified OAuth2/OIDC provider and must not be used in production as a replacement for specialized identity providers.

## Stack

- Monorepo with npm workspaces
- Backend: NestJS
- Frontend: Next.js
- Shared package: TypeScript contracts and constants
- Infrastructure: PostgreSQL, Redis and Mailpit with Docker Compose
- Validation: Zod
- Quality: ESLint, Prettier, Husky, commitlint and lint-staged

## Local Services

Docker Compose runs only the supporting services:

| Service        | URL                     |
| -------------- | ----------------------- |
| PostgreSQL     | `localhost:5432`        |
| Redis          | `localhost:6379`        |
| Mailpit SMTP   | `localhost:1025`        |
| Mailpit Web UI | `http://localhost:8025` |

The API and web app run locally with npm, outside Docker.

## Getting Started

```bash
npm install
copy .env.example .env
npm run infra:up
npm run dev:api
npm run dev:web
```

API healthcheck:

```bash
curl http://localhost:3001/health
```

Web app:

```bash
http://localhost:3000
```

## Quality Commands

```bash
npm run lint
npm run format:check
npm run typecheck
npm run build
```

## Commit Standard

This repository uses Conventional Commits and Semantic Versioning.

Examples:

```txt
feat(api): add healthcheck endpoint
chore(repo): configure npm workspaces
fix(web): correct dashboard loading state
```

## Current Scope

Implemented now:

- Phase 0: repository base, npm workspaces, documentation, quality tooling and hooks.
- Phase 1: local infrastructure with PostgreSQL, Redis and Mailpit, plus API healthcheck that validates service connectivity.

Next phases will add the backend foundation with Prisma, structured logging, global errors, OpenAPI, and then user registration.
