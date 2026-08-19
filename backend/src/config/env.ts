import "dotenv/config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`La variable de entorno ${name} no está definida`);
  }

  return value;
}

function getPort(): number {
  const port = Number(process.env.PORT ?? 3000);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("PORT debe ser un número válido entre 1 y 65535");
  }

  return port;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: getPort(),

  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
};