## 1. Configuración Estructural y Nombres

### Inconsistencia de Paquetes

Había cambiado el nombre de la aplicación ubicada en `apps/store-front` de `@store-system/client` a `@store-system/store-front` en su `package.json`, mientras que los scripts raíz y la estructura de directorios sugerían `@store-system/store-front`.

- **Corrección**: Se renombró el paquete a `@store-system/store-front` para mantener la consistencia semántica y funcional con TurboRepo.

### Estandarización de Pipelines

El archivo `turbo.json` definía una tarea `type-check`, pero varias aplicaciones (`admin-panel`, `warehouse-app`, `landing-page`) carecían de este script en sus `package.json`.

- **Corrección**: Se agregó el script `"type-check": "vue-tsc --noEmit"` (o `tsc`) en todos los paquetes para asegurar que el comando `turbo run type-check` funcione globalmente sin fallos (ver [Running Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)).

## 2. Aplicación API (`apps/api`)

La aplicación API presentaba la mayor cantidad de problemas de configuración, impidiendo su ejecución y compilación.

### Scripts y Dependencias

- **Scripts Faltantes**: No existían scripts para `dev`, `build` o `start`. Se crearon configuraciones estándar utilizando `tsx` para desarrollo y `tsc` para producción.
- **Dependencias**: Faltaban paquetes críticos como `express` y sus tipos `@types/express`, así como herramientas de desarrollo (`tsx`, `typescript`). Estas fueron instaladas en otra ruta y por eso faltaban aquí. Se instalaron correctamente 🦝

### Configuración de Nodemon y Runtime

Al intentar iniciar el servidor de desarrollo, surgieron varios errores técnicos importantes:

1.  **Ejecución de TypeScript**: `nodemon` intentaba usar `ts-node` por defecto, el cual no estaba instalado.
    - _Solución_: Se configuró el script `dev` y `nodemon.json` para utilizar `tsx` (`nodemon --exec tsx src/server.ts`).

2.  **Límite de Vigilancia de Archivos (`EMFILE`)**: `nodemon` fallaba con el error `EMFILE: too many open files`. Esto ocurría porque estaba intentando vigilar recursivamente la carpeta `node_modules`.
    - _Solución_: Se creó un archivo `nodemon.json` restringiendo la vigilancia únicamente al directorio `src` e ignorando `node_modules` y `dist`. Adicionalmente, se activó `legacyWatch: true` para mayor estabilidad en el entorno de desarrollo actual.

3.  **Puerto Bloqueado (`EADDRINUSE`)**: El puerto 4321 quedó bloqueado por un proceso "zombie" de intentos fallidos anteriores.
    - _Solución_: Se identificó y terminó el proceso que ocupaba el puerto.

## Correcciones de TypeScript (TS2742)

### IA generated:

Durante la compilación, surgió el error `TS2742` en `src/routes/user.ts`:

> "The inferred type of 'userRouter' cannot be named without a reference to..."

- **Detalle Técnico**: TypeScript no podía inferir correctamente el tipo exportado sin una referencia explicita de Express.
- **Corrección**: Se añadió el tipo explícito `: Router` a la constante `userRouter` importándolo de `express`.

```typescript
// Antes
const userRouter = express.Router();

// Después
import express, { Router } from "express";
const userRouter: Router = express.Router();
```

---
