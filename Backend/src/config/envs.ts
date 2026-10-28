import "dotenv/config";
import { get } from "env-var";

/**
 * Variables de entorno utilizadas por la aplicación.
 *
 * @remarks
 * Este objeto centraliza la lectura y validación de las variables
 * de entorno necesarias para el correcto funcionamiento del servidor.
 *
 * Las variables son obtenidas mediante `env-var`, lo que permite
 * validar tipos y valores por defecto.
 *
 * @example
 * ```ts
 * console.log(envs.PORT);
 * console.log(envs.PUBLIC_PATH);
 * ```
 */
export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  PUBLIC_PATH: get("PUBLIC_PATH").default("public").asString(),
  DB_HOST: get("DB_HOST").required().asString(),
  DB_PORT: get("DB_PORT").required().asPortNumber(),
  DB_USER: get("DB_USER").required().asString(),
  DB_PASSWORD: get("DB_PASSWORD").required().asString(),
  DB_NAME: get("DB_NAME").required().asString(),
};