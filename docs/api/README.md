# API Documentation (@store-system/api)

This section contains the documentation for the backend API of the Store System.

## Contents

- [**Architecture**](./architecture.md)
  - Explanation of the Layered Architecture pattern
  - Directory structure and responsibilities

- [**Implementation Roadmap**](./implementation-roadmap.md)
  - Step-by-step guide to building the API Foundation
  - Boilerplate, Security (CSRF), and Utilities

- [**Security**](./security.md)
  - CSRF implementation details (Double Submit Cookie)
  - Authentication flows and best practices

- [**Dependencies**](./dependencies.md)
  - List of required production and development packages

### System Documentation

- [**Database Schema**](../database.md)
  - Overview of the database structure and connections
- [**Data Models**](../models.md)
  - Detailed entities and relationships
- [**Requirements**](../requirements.md)
  - Functional and non-functional requirements of the system

## Key Architectural Highlights

### 1. CSRF Security Refactoring

- **Double Submit Cookie Pattern**: Implementation split into three specialized functions:
  - `csrfMiddleware`: Global initializer (generates token, sets httpOnly cookie).
  - `verifyCsrfToken`: Strict validator for write methods (POST, PUT, DELETE, PATCH).
  - `rotateCsrfToken`: Token rotation for critical events (e.g., Login) to prevent Session Fixation.
- **Type Integration**: Extended Express Request interface for `csrfToken` property.

### 2. Validation Architecture

- **Decoupled Controllers**: Removed validaton logic (`.run(req)`) from controllers.
- **Route-Level Validation**: Rules are injected as middleware in routes (e.g., `routes/userRoutes.ts`).
- **Lean Controllers**: Controllers focus solely on business orchestration.

### 3. Authentication Flow

- **Security Handshake**: Client must perform `GET /api/v1/auth/csrf-token` to obtain the token.
- **Enhanced Login**: Verification of credentials + `emailVerified` status.

### 4. Postman Automation

- **Auto-Capture**: Script to capture `csrfToken` from response and set environment variable.
- **Dynamic Headers**: Pre-configured `x-csrf-token` header using `{{csrfToken}}`.

## Pending Tasks

> Check the [Implementation Roadmap](./implementation-roadmap.md) to see the verified progress and what features are currently missing.
