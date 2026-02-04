# API Architecture

The API follows a [**Layered Architecture**](https://dev.to/yasmine_ddec94f4d4/understanding-the-layered-architecture-pattern-a-comprehensive-guide-1e2j) pattern. This separates the "shape" of the application (handling requests) from the "content" (business logic), ensuring modularity and easier maintenance.

## Directory Structure

```plaintext
apps/api/
├── src/
│   ├── config/          # Environment variables and constants
│   ├── controllers/     # Orchestrators: receive req, call services, return res
│   ├── middlewares/     # CSRF, JWT validation, global error handling
│   ├── routes/          # Endpoint definitions (index.ts, auth.routes.ts, etc.)
│   ├── services/        # Pure business logic (uses @store-system/db)
│   ├── utils/           # Helpers (token generators, nodemailer config)
│   ├── types/           # TypeScript type extensions (e.g. req.user, req.csrfToken)
│   └── server.ts        # Application entry point
├── package.json
└── tsconfig.json
```

## Layer Descriptions

### 1. Controllers

Controllers act as the entry point for requests. They bridge the gap between the HTTP layer and the business logic.

- **Responsibility:** Orchestrate business logic and manage HTTP responses.
- **Rule:** Controllers are "Lean". They should NOT contain validation logic (handled by route middleware) or direct database queries.

### 2. Services

Services contain the core business logic of the application.

- **Responsibility:** Execute logic, communicate with the database (via `@store-system/db`), and return data to the controller.
- **Rule:** Services should be framework-agnostic (no `req` or `res` objects).

### 3. Middlewares

Functions that run before the controller logic.

- **Examples:** CSRF protection, JWT authentication, Request validation, Error logging.

### 4. Utils

Helper functions and shared utilities.

- **Examples:** `mailer.ts` (Nodemailer wrapper), `jwt.ts` (Token generation), built-in validators.

### 5. Config

Centralized configuration management.

- **Purpose:** Store environment variables (e.g., specific ports, API keys) and validation logic to fail fast if configuration is missing.
