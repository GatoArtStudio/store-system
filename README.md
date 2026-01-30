# Store System Monorepo

Sistema de gestión de tienda con múltiples aplicaciones y paquetes compartidos.

## Estructura del Proyecto

### Aplicaciones (apps/)

- **admin-panel** - Panel de administración para gestión del sistema (Vue 3 + Vite)
- **store-front** - Aplicación web para clientes finales (Vue 3 + Vite)
- **warehouse-app** - Aplicación de gestión de bodega (Vue 3 + Vite)
- **landing-page** - Sitio web público de marketing (Astro)
- **api** - API REST del backend (Node.js + TypeScript)

### Paquetes Compartidos (packages/)

- **@store-system/types** - Tipos TypeScript compartidos entre todos los proyectos
- **@store-system/db** - Cliente de base de datos y esquemas (placeholder para ORM)
- **@store-system/ui-components** - Librería de componentes Vue reutilizables
- **@store-system/ui-theme** - Variables de diseño y estilos compartidos (SCSS)
- **@store-system/tsconfig** - Configuraciones TypeScript base para el monorepo

## Inicio Rápido

### Requisitos Previos

- Node.js v18 o superior
- pnpm v8 o superior

### Instalación

```bash
# Instalar todas las dependencias del monorepo
pnpm install

# Construir todos los paquetes compartidos
pnpm build
```

### Comandos Disponibles

```bash
# Desarrollo - Iniciar todos los servicios en modo watch
pnpm dev

# Build - Construir todos los paquetes y aplicaciones
pnpm build

# Type Check - Verificar tipos TypeScript en todo el monorepo
pnpm type-check

# Clean - Limpiar todos los archivos de build
pnpm clean
```

### Trabajar con Paquetes Específicos

```bash
# Ejecutar comando en un paquete específico
pnpm --filter @store-system/types build
pnpm --filter @store-system/ui-components dev

# Ejecutar en una aplicación específica
pnpm --filter @store-system/admin-panel dev
```

## Configuración TypeScript

El monorepo utiliza configuraciones TypeScript compartidas ubicadas en `packages/tsconfig/`:

- **base.json** - Configuración base con reglas estrictas para todos los proyectos
- **vue.json** - Configuración específica para aplicaciones Vue con Vite
- **node.json** - Configuración para proyectos Node.js/backend
- **astro.json** - Configuración para proyectos Astro
- **library.json** - Configuración para librerías/paquetes compartidos

Cada proyecto extiende estas configuraciones usando rutas relativas:

```json
{
  "extends": "../../packages/tsconfig/vue.json",
  "compilerOptions": {
    // Configuraciones específicas del proyecto
  }
}
```

## Desarrollo de Paquetes

### Agregar Dependencias entre Workspaces

```bash
# Agregar un paquete del workspace a otro
pnpm --filter @store-system/api add @store-system/types@workspace:*
pnpm --filter @store-system/admin-panel add @store-system/ui-components@workspace:*
```

### Agregar Dependencias Externas

```bash
# Agregar dependencia a un paquete específico
pnpm --filter @store-system/api add express
pnpm --filter @store-system/types add -D typescript
```

### Estructura de un Paquete Compartido

```
packages/types/
├── src/
│   ├── index.ts        # Punto de entrada principal
│   ├── user.ts         # Tipos relacionados con usuarios
│   └── product.ts      # Tipos relacionados con productos
├── dist/               # Archivos compilados (generados)
├── package.json        # Configuración del paquete
└── tsconfig.json       # Configuración TypeScript
```

## Arquitectura del Monorepo

### Gestión de Dependencias

- **pnpm workspaces** - Gestión eficiente de dependencias compartidas
- **workspace:\*** - Referencias entre paquetes del monorepo

### Build y Cache

- **Turborepo** - Sistema de build incremental con cache inteligente
- Dependencias de build configuradas en `turbo.json`
- Cache local para acelerar rebuilds

### Tipos Compartidos

El paquete `@store-system/types` provee tipos comunes:

```typescript
import type { User, Product } from '@store-system/types';
```

### Componentes Compartidos

El paquete `@store-system/ui-components` exporta componentes Vue:

```typescript
import { Button } from '@store-system/ui-components';
```

## Próximos Pasos

### Infraestructura Base

- [ ] Configurar ORM (Prisma/Drizzle) en `@store-system/db`
- [ ] Implementar API con framework (Express/Fastify/Hono)
- [ ] Configurar variables de entorno (.env y validación)
- [ ] Configurar Docker para desarrollo local

### Calidad de Código

- [ ] Configurar ESLint con reglas compartidas
- [ ] Configurar Prettier para formateo consistente
- [ ] Configurar Husky para git hooks
- [ ] Implementar pre-commit linting

### Testing

- [ ] Configurar Vitest para pruebas unitarias
- [ ] Configurar Playwright para pruebas E2E
- [ ] Agregar pruebas a paquetes críticos
- [ ] Configurar coverage reports

### CI/CD

- [ ] Configurar GitHub Actions / GitLab CI
- [ ] Pipeline de testing automático
- [ ] Build y deploy automático
- [ ] Semantic versioning y changelogs

## Stack Tecnológico

### Core

- **Package Manager:** pnpm 10.19.0
- **Build System:** Turborepo 2.7.6
- **Runtime:** Node.js v25+
- **Lenguaje:** TypeScript 5.7.3

### Frontend

- **Framework:** Vue 3.5.13
- **Build Tool:** Vite 6.0.7+
- **Static Site:** Astro
- **Styling:** SCSS

### Herramientas de Desarrollo

- **Bundler:** Vite
- **Type Checking:** vue-tsc, tsc
- **Module Resolution:** pnpm workspaces

## Convenciones

### Nombres de Paquetes

- Apps: nombres en kebab-case (admin-panel, warehouse-app)
- Packages: scope @store-system con kebab-case (@store-system/ui-components)

### Estructura de Archivos

- `src/` - Código fuente
- `dist/` - Archivos compilados (no commiteados)
- `public/` - Archivos estáticos (solo apps)

### Commits

Se recomienda seguir Conventional Commits:

```
feat(api): add user authentication endpoint
fix(ui-components): correct button hover state
docs(readme): update installation steps
```

## Recursos Adicionales

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
