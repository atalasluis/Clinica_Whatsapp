# Clinic WhatsApp

Sistema de automatización de atención, ventas y agendamiento
para una clínica mediante WhatsApp e inteligencia artificial.

## Tecnologías

- Node.js
- Express
- TypeScript
- React
- Vite
- PostgreSQL
- Prisma
- Botpress

## Estructura

```text
backend/     API y lógica de negocio
frontend/    Interfaz web
database/    Documentación y scripts de BD
docs/        Documentación técnica
```
## Base de datos

El proyecto utiliza PostgreSQL alojado en Supabase.

## Configuración
* Motor: PostgreSQL
* Proveedor: Supabase
* ORM: Prisma 7.9.1
* Esquema utilizado: public
* Estado actual: Base de datos vacía, sin tablas creadas.
* Conexión: Supabase Session Pooler mediante IPv4.

La conexión de Prisma se configura mediante la variable de entorno DATABASE_URL ubicada en el archivo .env.

La configuración de Prisma 7 se encuentra en:

backend/
├── prisma.config.ts
└── prisma/
    └── schema.prisma

prisma.config.ts utiliza DATABASE_URL para establecer la conexión:

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});

El archivo schema.prisma contiene la definición del proveedor PostgreSQL:

datasource db {
  provider = "postgresql"
}
## Verificación de conexión

La conexión con Supabase fue comprobada correctamente mediante:

npx prisma db pull

Prisma logró conectarse al servidor PostgreSQL. El resultado P4001 indicó que la base de datos está actualmente vacía y no contiene tablas para realizar la introspección.

La variable DATABASE_URL y las credenciales de Supabase no deben incluirse en el repositorio.

## Desarrollo
### Backend
    cd backend
    npm install
    npm run dev
### Frontend
    cd frontend
    npm install
    npm run dev