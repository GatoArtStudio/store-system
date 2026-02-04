# Database Setup and Configuration

This document describes the database setup using Prisma ORM v7 with a modular schema architecture in a monorepo structure.

## Overview

The store-system uses SQLite as the database provider with Prisma ORM v7 for type-safe database access. The database is shared across all applications in the monorepo. The database schema is organized into multiple modular files for better maintainability.

Related documentation:

- [Database Models](./models.md) - Detailed model definitions and relationships

## Architecture

### Modular Schema Structure

The Prisma schema is split into multiple files for better organization and maintainability:

```
packages/db/
├── prisma/
│   ├── schema/
│   │   ├── base.prisma         # Generator and datasource configuration
│   │   ├── auth.prisma         # User authentication models
│   │   ├── hr.prisma           # HR and employee management models
│   │   ├── sales.prisma        # Sales and payment models
│   │   └── inventory.prisma    # Product and warehouse models
│   └── migrations/             # Database migration history
├── prisma.config.ts            # Prisma CLI configuration (Prisma 7)
├── src/
│   └── index.ts                # Prisma Client singleton with adapter
└── package.json
```

### Shared Database Location

The SQLite database file (`dev.db`) is stored at the monorepo root to ensure all applications access the same data:

```
store-system/
├── dev.db                      # Shared SQLite database
├── .env                        # DATABASE_URL configuration
└── packages/db/                # Database package
```

## Prerequisites

- Node.js >= 20.19.0
- pnpm >= 8.0.0
- TypeScript >= 5.4.0

## Initial Setup

### 1. Install Dependencies

From the `packages/db` directory:

```bash
cd packages/db
pnpm install
```

Required dependencies:

- `@prisma/client@^7.3.0` - Prisma Client
- `prisma@^7.3.0` - Prisma CLI
- `@prisma/adapter-better-sqlite3` - SQLite adapter for Prisma 7
- `better-sqlite3` - SQLite driver
- `@types/better-sqlite3` - TypeScript types

**Native Dependencies (pnpm Configuration)**

To support native modules in pnpm v10+, the root [`package.json`](../package.json) includes a whitelist of allowed build scripts:

```json
"pnpm": {
  "onlyBuiltDependencies": [
    "better-sqlite3",
    "bcrypt",
    "prisma",
    "@prisma/engines",
    "esbuild",
    "sharp",
    "@parcel/watcher"
  ]
}
```

### 2. Environment Configuration

Create a `.env` file at the monorepo root (if not exists):

```bash
# /store-system/.env
DATABASE_URL="file:./dev.db"
```

Ensure `.gitignore` includes database files:

```gitignore
# Database files
*.db
*.db-journal
dev.db
dev.db-journal
```

### 3. Prisma Configuration

The `prisma.config.ts` file configures the Prisma CLI for Prisma 7:

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema", // Points to schema directory
  datasource: {
    url: process.env.DATABASE_URL || "file:../../dev.db",
  },
  migrations: {
    path: "./prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
```

Key points:

- `schema` points to the directory containing modular `.prisma` files
- `datasource.url` reads from environment or uses fallback path
- Migrations are stored in `./prisma/migrations`

## Database Generation

### Generate Prisma Client

Generate the TypeScript client from the schema files:

```bash
cd packages/db
pnpm exec prisma generate
```

This command:

1. Reads all `.prisma` files from `prisma/schema/` directory
2. Validates the schema and relationships
3. Generates TypeScript types and client code
4. Outputs to `node_modules/.prisma/client`

### Create Database and Run Migrations

Create the database file and apply schema changes:

```bash
cd packages/db
pnpm exec prisma migrate dev --name init_auth_and_hr
```

This command:

1. Creates `dev.db` at the monorepo root
2. Generates a new migration in `prisma/migrations/`
3. Applies the migration to the database
4. Updates the `_prisma_migrations` table

For subsequent schema changes:

```bash
pnpm exec prisma migrate dev --name <descriptive_name>
```

### Alternative: Push Schema (Development Only)

For rapid prototyping without creating migration files:

```bash
cd packages/db
pnpm exec prisma db push
```

**Warning**: This bypasses migration history and should only be used in early development.

## Database Seeding

The database includes a seed script to initialize essential data, such as the default admin user.

### Configuration

The seed command is configured in `prisma.config.ts` using `tsx` for direct TypeScript execution:

```typescript
migrations: {
  seed: "tsx prisma/seed.ts";
}
```

### Running the Seed

You can run the seed command from the workspace root:

```bash
pnpm run -w db:seed
```

This executes `packages/db/prisma/seed.ts`.

## Prisma 7 Specifics

### Driver Adapter Pattern

Prisma 7 requires explicit driver adapters for all databases. The client instantiation in `src/index.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

// Uses process.cwd() for robust path resolution from monorepo root
const rootPath = process.cwd();
const dbPath = path.join(rootPath, "dev.db");

// The adapter manages the connection internally
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

export const prisma = new PrismaClient({
  adapter,
  log: ["query"],
});
```

Key changes from Prisma 6:

- No `datasourceUrl` option (use adapter)
- Adapter handles database connection lifecycle internally
- No need to manually create Database instance
- Adapter wraps the database driver
- Database path is resolved programmatically

### Schema File Changes

In Prisma 7, the datasource block no longer includes `url`:

```prisma
// base.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../../../node_modules/.prisma/client"
}

datasource db {
  provider = "sqlite"
  // No url field - configured via prisma.config.ts
}
```

The `output` field is now required to specify where the client is generated.

## Common Commands

### Quick Start (Workspace Scripts)

From the monorepo root, use these convenient scripts:

```bash
# Generate Prisma Client after schema changes
pnpm run -w db:generate

# Create and apply migration
pnpm run -w db:migrate

# Open Prisma Studio (database GUI)
pnpm run -w db:studio

# Push schema changes without migration files (dev only)
pnpm run -w db:push

# Seed the database
pnpm run -w db:seed
```

### Direct Prisma Commands

If you need more control or additional Prisma commands, navigate to the db package:

```bash
cd packages/db

# Generate client after schema changes
pnpm exec prisma generate

# Create migration with custom name
pnpm exec prisma migrate dev --name <migration_name>

# Open Prisma Studio
pnpm exec prisma studio

# Reset database (WARNING: deletes all data)
pnpm exec prisma migrate reset

# Format schema files
pnpm exec prisma format

# Check migration status
pnpm exec prisma migrate status
```

### Production Deployment

```bash
# Apply pending migrations
pnpm exec prisma migrate deploy

# Generate client (without interactive prompts)
pnpm exec prisma generate
```

## Using the Database Package

### Import in Applications

In any app within the monorepo (`apps/api`, `apps/admin-panel`, etc.):

```typescript
import { prisma } from "@store-system/db";

// Type-safe database operations
const users = await prisma.user.findMany({
  include: { employee: true },
});
```

### Available Models

See [models.md](./models.md) for detailed model definitions. Quick reference:

| Module           | Models                                               |
| ---------------- | ---------------------------------------------------- |
| auth.prisma      | User                                                 |
| hr.prisma        | Employee, Payroll, Schedule, TimeOff                 |
| sales.prisma     | Sale, SaleItem, Payment, Discount, Refund            |
| inventory.prisma | Product, StockLog, Warehouse, Transfer, TransferItem |

## Troubleshooting

### "Cannot find module '@prisma/client'"

Run `pnpm exec prisma generate` to generate the client.

### "Error: P1010: User was denied access on the database"

For SQLite, ensure the database file path is accessible and the directory exists.

### Migration conflicts

If migrations are out of sync:

```bash
# View migration status
pnpm exec prisma migrate status

# Reset and reapply (development only)
pnpm exec prisma migrate reset
```

### Changes not reflecting

After modifying schema files:

1. Run `pnpm exec prisma generate` to update the client
2. Run `pnpm exec prisma migrate dev --name <change_description>` to apply changes
3. Restart your development server

## Resources

- [Prisma ORM v7 Documentation](https://www.prisma.io/docs/orm)
- [Upgrade Guide to Prisma 7](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Prisma Schema Reference](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)
- [Prisma CLI Reference](https://www.prisma.io/docs/orm/reference/prisma-cli-reference)
