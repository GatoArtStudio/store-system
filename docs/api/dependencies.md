# API Needed Dependencies

To maintain consistency with the monorepo and database package, the following dependencies are required for the `apps/api` package.

## Production Dependencies

These packages are used in the runtime environment.

| Package             | Purpose                                        |
| :------------------ | :--------------------------------------------- |
| `express`           | Web framework                                  |
| `cookie-parser`     | Parse Cookie header and populate `req.cookies` |
| `jsonwebtoken`      | JWT generation and verification                |
| `nodemailer`        | Email sending (SMTP)                           |
| `express-validator` | Request validation                             |
| `cors`              | Cross-Origin Resource Sharing enablement       |
| `helmet`            | Security headers                               |
| `@store-system/db`  | Internal package for database access           |

## Development Dependencies

These packages are used only during development.

| Package                | Purpose                                                 |
| :--------------------- | :------------------------------------------------------ |
| `typescript`           | TypeScript compiler                                     |
| `tsx`                  | TypeScript execution engine (no pre-compilation needed) |
| `nodemon`              | Watch mode file changes (can be combined with tsx)      |
| `@types/express`       | Types for Express                                       |
| `@types/cookie-parser` | Types for Cookie Parser                                 |
| `@types/jsonwebtoken`  | Types for JWT                                           |
| `@types/nodemailer`    | Types for Nodemailer                                    |
| `@types/node`          | Node.js types                                           |

## Installation Command

```bash
# Production
pnpm add express cookie-parser jsonwebtoken nodemailer express-validator cors helmet @store-system/db

# Development
pnpm add -D typescript tsx nodemon @types/express @types/cookie-parser @types/jsonwebtoken @types/nodemailer @types/node
```
