import "dotenv/config";
import { readFile } from "fs/promises";
import path from "path";
import { pool } from "../config/database";

async function initializeDatabase(): Promise<void> {
  try {
    const sqlPath = path.resolve(
      process.cwd(),
      "src/database",
      "init.sql"
    );

    const sql = await readFile(sqlPath, "utf-8");

    await pool.query(sql);

    console.log("Tablas creadas correctamente");
  } catch (error) {
    console.error("Error al crear las tablas:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

initializeDatabase();