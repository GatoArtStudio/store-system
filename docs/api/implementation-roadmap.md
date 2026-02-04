# API Implementation Map

This roadmap outlines the steps to build the API foundation, focusing on security and structure first.

## Phase 1: Foundation & Security

**Goal:** Establish a secure base with CSRF protection, Type-Safe boilerplate, and essential utilities.

### Step 1: Dependencies

- [x] Install all required dependencies (see [dependencies.md](./dependencies.md)).

### Step 2: Architecture Setup

- [x] Create the folder structure defined in [architecture.md](./architecture.md).

### Step 3: Type Definitions & CSRF

Your custom CSRF middleware needs to be compatible with TypeScript.

- [x] Create `src/types/express.d.ts`.
- [x] Extend the Express interface:

```typescript
declare namespace Express {
  export interface Request {
    csrfToken?: string;
  }
}
```

- [x] Implement the segmented CSRF logic:
  - `csrfMiddleware` (Token generation & cookie setting).
  - `verifyCsrfToken` (Header validation for mutations).
  - `rotateCsrfToken` (Session fixation protection).

### Step 4: Express Boilerplate (`server.ts`)

Set up the main application entry point.

- [x] Initialize `express`.
- [x] Configure global middlewares:
  - `helmet()` (Security headers)
  - `cors()` (Cross-origin requests)
  - `express.json()` (Body parsing)
  - `cookie-parser()` (Cookie parsing)
- [x] Inject your custom implementation of `csrfMiddleware`.

### Step 5: Mailer Utility

Prepare the system for sending transactional emails (verification, reset password).

- [ ] Create `src/utils/mailer.ts`.
- [ ] specific SMTP transporter configuration.
- [ ] Create a generic `sendEmail` function accepting `template`, `to`, and `subject`.

### Step 6: Security Handshake

- [x] Create the **Handshake Endpoint**: `GET /api/v1/auth/csrf-token`.
- [x] Ensure it returns `{ csrfToken: "..." }`.
- [ ] **Verify:** Use Postman to check that `httpOnly` cookie is set and token is returned.

### Step 7: Validation Infrastructure

- [x] Implement **Route-Level Validation** middleware (removing `.run(req)` from controllers).
- [x] Refactor controllers to be **"Lean"** (business logic orchestration only).

---

## Phase 2: Authentication (Future)

_To be defined after Phase 1 completion._
