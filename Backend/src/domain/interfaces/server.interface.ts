import { Router } from "express";

/**
 * Configuración de opciones para el servidor.
 */
export interface Options {
  /** Puerto donde se levantará el servidor */
  port: number;

  /** Ruta al directorio público (archivos estáticos) */
  publicPath: string;

  /** Router principal de la aplicación */
  routes: Router;

  /** Opciones para conexión con bases de datos */
  database: Database;
}

export interface Database {
  dbPort: number;
  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
}